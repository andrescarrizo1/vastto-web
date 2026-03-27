import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const SRC_DIR = path.join(__dirname, '../src');

// Busca todos los archivos .astro recursivamente
function getAstroFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAstroFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.astro')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

// Scrapper
async function scrapeMLPrice(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Lógica inyectada en el navegador
    const data = await page.evaluate(() => {
      let originalPrice = null;
      let currentPrice = null;
      let outOfStock = false;
      
      // Chequear si está pausada o sin stock
      const outOfStockEl = document.querySelector('.ui-pdp-message');
      if (outOfStockEl && outOfStockEl.innerText.toLowerCase().includes('pausada')) {
        outOfStock = true;
      }

      const originalBlock = document.querySelector('.ui-pdp-price__original-value .andes-money-amount__fraction');
      if (originalBlock) {
        originalPrice = parseInt(originalBlock.innerText.replace(/\D/g, ''));
      }

      const currentBlock = document.querySelector('.ui-pdp-price__second-line .andes-money-amount__fraction') || document.querySelector('.ui-pdp-price .andes-money-amount__fraction');
      if (currentBlock) {
        currentPrice = parseInt(currentBlock.innerText.replace(/\D/g, ''));
      }

      return { currentPrice, originalPrice, outOfStock };
    });
    
    return data;
  } catch (err) {
    console.error(`Error scrapeando ${url}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('Iniciando Puppeteer...');
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  
  // Evitar bloqueos seteando un User-Agent normal
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

  const astroFiles = getAstroFiles(SRC_DIR);
  console.log("Archivos Astro encontrados:", astroFiles.length);
  let updatedCount = 0;

  for (const file of astroFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let lines = content.split('\n');
    let fileChanged = false;

    // Buscar URLs de ML
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('url') && lines[i].includes('mercadolibre.com.ar/')) {
        let url = '';
        if (lines[i].includes("'")) {
          url = lines[i].split("'")[1];
        } else if (lines[i].includes('"')) {
          const parts = lines[i].split('"');
          // el indice del split de url "url": "https..."
          // parts = [ '    ', 'url', ': ', 'https...', ',' ]
          for (let p of parts) {
            if (p.includes('http')) url = p;
          }
        }
        
        if (!url.includes('http')) continue;
        console.log("Encontrada URL:", url);
        
        let priceIndex = -1;
        let originalPriceIndex = -1;
        
        for (let j = i - 1; j >= Math.max(0, i - 15); j--) {
          if ((lines[j].includes('price:') || lines[j].includes('"price":')) && !lines[j].includes('originalPrice')) {
            priceIndex = j;
            break;
          }
        }
        for (let j = i - 1; j >= Math.max(0, i - 15); j--) {
          if (lines[j].includes('originalPrice:') || lines[j].includes('"originalPrice":')) {
            originalPriceIndex = j;
            break;
          }
        }

        console.log("Índice de precio encontrado:", priceIndex);

        if (priceIndex !== -1) {
          console.log(`Visitando: ${url}`);
          const data = await scrapeMLPrice(page, url);
          
          if (data && data.currentPrice) {
            // Reemplazar Precio Actual
            const oldPriceMatch = lines[priceIndex].match(/\d+/);
            if (oldPriceMatch) {
              const oldPrice = oldPriceMatch[0];
              if (oldPrice !== data.currentPrice.toString()) {
                lines[priceIndex] = lines[priceIndex].replace(oldPrice, data.currentPrice);
                console.log(`  -> Precio actualizado: $${oldPrice} -> $${data.currentPrice}`);
                fileChanged = true;
              } else {
                console.log(`  -> Precio sin cambios: $${oldPrice}`);
              }
            }

            // Reemplazar Precio Original (si existe)
            if (originalPriceIndex !== -1) {
               let oldOriginalRaw = '';
               const oldOrigMatch = lines[originalPriceIndex].match(/\d+/);
               let newOriginalStr = data.originalPrice ? data.originalPrice.toString() : 'null';
               
               if (oldOrigMatch) {
                 oldOriginalRaw = oldOrigMatch[0];
               } else if (lines[originalPriceIndex].includes('null')) {
                 oldOriginalRaw = 'null';
               } else if (lines[originalPriceIndex].includes('undefined')) {
                 oldOriginalRaw = 'undefined';
               }
               
               if (oldOriginalRaw !== '' && oldOriginalRaw !== newOriginalStr) {
                 lines[originalPriceIndex] = lines[originalPriceIndex].replace(oldOriginalRaw, newOriginalStr);
                 console.log(`  -> Precio original actualizado: ${oldOriginalRaw} -> ${newOriginalStr}`);
                 fileChanged = true;
               }
            }
          } else if (data && data.outOfStock) {
             console.log(`  -> [ALERTA] Publicación pausada o sin stock.`);
          }
        }
      }
    }

    if (fileChanged) {
      fs.writeFileSync(file, lines.join('\n'), 'utf8');
      updatedCount++;
    }
  }

  await browser.close();
  console.log(`\\nProceso terminado. Archivos actualizados: ${updatedCount}`);
}

main().catch(console.error);
