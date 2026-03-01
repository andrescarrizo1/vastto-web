import fs from 'fs';
import { chromium } from 'playwright';
import https from 'https';
import path from 'path';

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            } else if (res.statusCode === 301 || res.statusCode === 302) {
                download(res.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(new Error(`Failed ${res.statusCode} on ${url}`));
            }
        }).on('error', reject);
    });
}

function processAstroFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /image:\s*'(\/images\/[^']+)',\s*\n\s*url:\s*'([^']+)'/g;
    let match;
    const products = [];
    while ((match = regex.exec(content)) !== null) {
        products.push({
            currentImageLoc: match[1],   // e.g. /images/D_NQ_NP_...-O.webp
            url: match[2]
        });
    }
    return products;
}

(async () => {
    const astroFiles = [
        'C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/src/pages/[categoria].astro',
        'C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/src/pages/index.astro'
    ];

    // gather all unique products
    const allProductsMap = new Map();
    for (const f of astroFiles) {
        const prods = processAstroFile(f);
        for (const p of prods) {
            allProductsMap.set(p.url, p);
        }
    }
    const products = Array.from(allProductsMap.values());
    console.log(`Found ${products.length} unique products to scrape.`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let replacements = [];

    for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        console.log(`[${i + 1}/${products.length}] Scraping ${prod.url.split('/')[3]}...`);
        try {
            await page.goto(prod.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            // Find main product image
            const imgUrl = await page.evaluate(() => {
                const img = document.querySelector('.ui-pdp-gallery__figure__image');
                if (img) return img.src;
                // fallback for different catalog pages
                const img2 = document.querySelector('.ui-pdp-image');
                if (img2) return img2.src;
                return null;
            });

            if (imgUrl) {
                console.log(`   Found: ${imgUrl}`);
                const filename = imgUrl.split('/').pop();
                const destPath = path.join('C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/public/images', filename);

                await download(imgUrl, destPath);
                const stats = fs.statSync(destPath);
                console.log(`   Downloaded ${filename} (${Math.round(stats.size / 1024)}KB)`);

                if (prod.currentImageLoc !== `/images/${filename}`) {
                    replacements.push({
                        old: prod.currentImageLoc,
                        new: `/images/${filename}`
                    });
                }
            } else {
                console.log(`   WARN: No image found on page.`);
            }
        } catch (e) {
            console.error(`   Error: ${e.message}`);
        }
        await new Promise(r => setTimeout(r, 1000));
    }

    await browser.close();

    // Update Astro files with new filenames
    console.log('Updating Astro files...');
    for (const f of astroFiles) {
        let content = fs.readFileSync(f, 'utf-8');
        let modified = false;
        for (const r of replacements) {
            if (content.includes(r.old)) {
                content = content.split(r.old).join(r.new);
                modified = true;
            }
        }
        if (modified) {
            fs.writeFileSync(f, content, 'utf-8');
            console.log(`Updated ${path.basename(f)}`);
        }
    }
    console.log('All done!');
})();
