import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());

function processAstroFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /image:\s*'(\/images\/[^']+)',\s*\n\s*url:\s*'([^']+)'/g;
    let match;
    const products = [];
    while ((match = regex.exec(content)) !== null) {
        products.push({ currentImageLoc: match[1], url: match[2] });
    }
    return products;
}

(async () => {
    const astroFiles = [
        'C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/src/pages/[categoria].astro',
        'C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/src/pages/index.astro'
    ];

    const allProductsMap = new Map();
    for (const f of astroFiles) {
        for (const p of processAstroFile(f)) {
            allProductsMap.set(p.url, p);
        }
    }
    const products = Array.from(allProductsMap.values());
    console.log(`Found ${products.length} products`);

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    });

    let replacements = [];

    for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        console.log(`[${i + 1}/${products.length}] Scraping ${prod.url.split('/')[3]}...`);
        const page = await browser.newPage();

        try {
            await page.goto(prod.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Wait for React to render the image elements
            await page.waitForSelector('.ui-pdp-gallery__figure__image, .ui-pdp-image', { timeout: 15000 }).catch(() => console.log('Timeout waiting for selector'));

            // Extract image src
            const imgUrl = await page.evaluate(() => {
                const img = document.querySelector('.ui-pdp-gallery__figure__image');
                if (img) return img.src;
                const img2 = document.querySelector('.ui-pdp-image'); // Fallback
                if (img2) return img2.src;
                return null;
            });

            if (imgUrl) {
                console.log(`   Found: ${imgUrl}`);
                const filename = imgUrl.split('/').pop();
                const destPath = path.join('C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/public/images', filename);

                // Use page.goto to download the image file to avoid fetch blocks
                const viewSource = await page.goto(imgUrl);
                const buffer = await viewSource.buffer();
                fs.writeFileSync(destPath, buffer);
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
                // Save screenshot for debugging
                await page.screenshot({ path: `debug_${i}.png` });
            }
        } catch (e) {
            console.error(`   Error: ${e.message}`);
        }
        await page.close();
        await new Promise(r => setTimeout(r, 1000));
    }

    await browser.close();

    console.log('Updating files...');
    for (const f of astroFiles) {
        let content = fs.readFileSync(f, 'utf-8');
        let mod = false;
        for (const r of replacements) {
            if (content.includes(r.old)) {
                content = content.split(r.old).join(r.new);
                mod = true;
            }
        }
        if (mod) {
            fs.writeFileSync(f, content, 'utf-8');
            console.log(`Updated ${path.basename(f)}`);
        }
    }
})();
