import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

// Helper: fetch with allorigins proxy
async function checkMLStatus(url) {
    try {
        const mlaMatch = url.match(/(MLA\d+)/);
        if (!mlaMatch) return { active: true }; // Can't tell, keep it
        const mlaId = mlaMatch[1];

        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(`https://api.mercadolibre.com/items/${mlaId}`);
        const res = await fetch(proxyUrl, { timeout: 10000 });
        if (!res.ok) return { active: false, reason: `HTTP ${res.status}` };

        const data = await res.json();
        const isActive = data.status === 'active' && data.available_quantity > 0;
        return { active: isActive, reason: data.status };
    } catch (e) {
        return { active: true, reason: 'error check' }; // keep on error
    }
}

function extractArrays(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /(const \w+ = )(\[\s*\{[\s\S]*?\}\s*\]);/g;
    let match;
    const arrays = [];
    while ((match = regex.exec(content)) !== null) {
        arrays.push({ full: match[0], prefix: match[1], jsonStr: match[2] });
    }
    return arrays;
}

// Transform pseudo-JS objects to valid JSON to parse them 
// (Astro files use JS object literals, not strict JSON)
// Safer: we can just use eval since we trust the local file
function parseJSArray(str) {
    return eval('(' + str + ')');
}

function stringifyJSArray(arr) {
    const items = arr.map(obj => {
        let props = [];
        for (let k in obj) {
            let val = obj[k];
            if (typeof val === 'string') val = `'${val.replace(/'/g, "\\'")}'`;
            props.push(`    ${k}: ${val}`);
        }
        return `  {\n${props.join(',\n')}\n  }`;
    });
    return `[\n${items.join(',\n')}\n]`;
}

(async () => {
    const astroFiles = [
        'C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/src/pages/[categoria].astro',
        'C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/src/pages/index.astro'
    ];

    let allProductsToFixImages = [];

    for (const f of astroFiles) {
        let content = fs.readFileSync(f, 'utf-8');
        const arrays = extractArrays(f);
        let modifiedFile = false;

        for (const arrData of arrays) {
            if (!arrData.full.includes('image:')) continue; // Skip non-product arrays

            const arr = parseJSArray(arrData.jsonStr);
            const filteredArr = [];

            for (let i = 0; i < arr.length; i++) {
                const prod = arr[i];
                console.log(`Checking status: ${prod.title}`);
                const status = await checkMLStatus(prod.url);

                if (status.active) {
                    filteredArr.push(prod);

                    // Check if image is 8kb dummy
                    const imgLocalPath = path.join('C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/public', prod.image);
                    const isMissing = prod.image.includes('-O.webp') || !fs.existsSync(imgLocalPath) || fs.statSync(imgLocalPath).size < 12000;

                    if (isMissing) {
                        allProductsToFixImages.push({ prodObj: filteredArr[filteredArr.length - 1], file: f, originalStr: prod.image });
                    }
                } else {
                    console.log(`❌ REMOVED: ${prod.title} (Status: ${status.reason})`);
                    modifiedFile = true;
                }
            }

            if (filteredArr.length !== arr.length) {
                const newArrStr = stringifyJSArray(filteredArr);
                content = content.replace(arrData.full, arrData.prefix + newArrStr + ';');
                modifiedFile = true;
            }
        }

        if (modifiedFile) {
            fs.writeFileSync(f, content, 'utf-8');
            console.log(`Updated products in ${path.basename(f)}`);
        }
    }

    console.log(`\nFound ${allProductsToFixImages.length} images to re-scrape.`);

    if (allProductsToFixImages.length > 0) {
        const browser = await puppeteer.launch({ headless: true });
        // Deduplicate searching by title
        const searched = new Map();

        for (let i = 0; i < allProductsToFixImages.length; i++) {
            const item = allProductsToFixImages[i];
            console.log(`[${i + 1}/${allProductsToFixImages.length}] Fixing Image: ${item.prodObj.title}`);

            let imgUrl = searched.get(item.prodObj.title);

            if (!imgUrl) {
                const page = await browser.newPage();
                try {
                    await page.setViewport({ width: 1280, height: 800 });
                    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

                    const query = encodeURIComponent(item.prodObj.title + ' "blanco" fondo');
                    await page.goto(`https://www.google.com/search?tbm=isch&q=${query}`, { waitUntil: 'domcontentloaded' });

                    imgUrl = await page.evaluate(() => {
                        const imgs = Array.from(document.querySelectorAll('img'));
                        for (const img of imgs) {
                            if (img.width > 80 && img.height > 80 && img.src && (img.src.startsWith('http') || img.src.startsWith('data:image'))) {
                                return img.src;
                            }
                        }
                        return null;
                    });

                    searched.set(item.prodObj.title, imgUrl); // cache for the other astro file
                } catch (e) { console.error(`Error: ${e.message}`); }
                await page.close();
                await new Promise(r => setTimeout(r, 1000));
            }

            if (imgUrl) {
                const cleanName = item.prodObj.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg';
                const destPath = path.join('C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/public/images', cleanName);

                try {
                    if (imgUrl.startsWith('data:image')) {
                        const base64Data = imgUrl.replace(/^data:image\/jpeg;base64,/, "");
                        const buffer = Buffer.from(base64Data, 'base64');
                        fs.writeFileSync(destPath, buffer);
                    } else {
                        // fetch and save
                        const http = imgUrl.startsWith('https') ? require('https') : require('http');
                        await new Promise((res, rej) => {
                            http.get(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, response => {
                                const file = fs.createWriteStream(destPath);
                                response.pipe(file);
                                file.on('finish', () => { file.close(); res(); });
                            }).on('error', rej);
                        });
                    }

                    const newWebPath = `/images/${cleanName}`;
                    console.log(`   Saved -> ${newWebPath}`);

                    let fContent = fs.readFileSync(item.file, 'utf-8');
                    fContent = fContent.replace(item.originalStr, newWebPath);
                    fs.writeFileSync(item.file, fContent, 'utf-8');
                } catch (e) { console.error("   File error", e); }
            } else {
                console.log("   No image found.");
            }
        }
        await browser.close();
    }

    console.log("Complete!");
})();
