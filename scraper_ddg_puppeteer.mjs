import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

puppeteer.use(StealthPlugin());

function processAstroFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /title:\s*'([^']+)',\s*price:[^}]*?image:\s*'(\/images\/[^']+)'/g;
    let match;
    const products = [];
    while ((match = regex.exec(content)) !== null) {
        products.push({
            title: match[1],
            currentImageLoc: match[2],
            isPlaceholder: match[2].includes('placeholder') || match[2].includes('MLA')
        });
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
            // Only update if it's currently a placeholder or MLA filename (the ones that failed)
            if (p.isPlaceholder) {
                allProductsMap.set(p.title, p);
            }
        }
    }
    const products = Array.from(allProductsMap.values());
    console.log(`Found ${products.length} placeholder products to fix`);

    const browser = await puppeteer.launch({ headless: true });
    let replacements = [];

    for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        console.log(`[${i + 1}/${products.length}] Searching Google/DDG Images for: ${prod.title}`);

        const page = await browser.newPage();
        try {
            // DDG is easy to scrape
            const query = encodeURIComponent(prod.title + ' blanco fondo');
            await page.goto(`https://duckduckgo.com/?q=${query}&iax=images&ia=images`, { waitUntil: 'networkidle2' });

            const imgUrl = await page.evaluate(() => {
                const images = Array.from(document.querySelectorAll('img.tile--img__img'));
                for (let img of images) {
                    if (img.src && img.src.startsWith('http')) {
                        // Some DuckDuckGo images are proxied external URLs in the src attribute.
                        return img.src;
                    }
                }
                return null;
            });

            if (imgUrl) {
                console.log(`   Found image: ${imgUrl.substring(0, 60)}...`);
                const cleanName = prod.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg';
                const destPath = path.join('C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/public/images', cleanName);

                // DDG proxy URLs often don't have extensions, but they are jpeg
                const viewSource = await page.goto(imgUrl);
                const buffer = await viewSource.buffer();
                fs.writeFileSync(destPath, buffer);
                const stats = fs.statSync(destPath);
                console.log(`   Saved ${cleanName} (${Math.round(stats.size / 1024)}KB)`);

                if (stats.size > 2000) { // Valid image
                    const newWebPath = `/images/${cleanName}`;
                    if (prod.currentImageLoc !== newWebPath) {
                        replacements.push({ old: prod.currentImageLoc, new: newWebPath });
                    }
                } else {
                    console.log(`   Image too small, ignoring.`);
                }
            } else {
                console.log(`   No image found on DDG.`);
            }
        } catch (e) {
            console.error(`   Error: ${e.message}`);
        }
        await page.close();
        await new Promise(r => setTimeout(r, 1000));
    }

    await browser.close();

    console.log(`Updating Astro files with ${replacements.length} new image paths...`);
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
    console.log('All missing images replaced via search engine!');
})();
