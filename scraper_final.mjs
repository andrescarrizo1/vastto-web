import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

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
            if (p.isPlaceholder || p.currentImageLoc.includes('-O.webp')) {
                allProductsMap.set(p.title, p);
            }
        }
    }
    const products = Array.from(allProductsMap.values());
    console.log(`Found ${products.length} products to fix`);

    if (products.length === 0) {
        console.log("No placeholder images to fix.");
        process.exit(0);
    }

    const browser = await puppeteer.launch({ headless: true });
    let replacements = [];

    for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        console.log(`[${i + 1}/${products.length}] Searching Google Images for: ${prod.title}`);

        const page = await browser.newPage();
        try {
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

            const query = encodeURIComponent(prod.title + ' "blanco" fondo');
            await page.goto(`https://www.google.com/search?tbm=isch&q=${query}`, { waitUntil: 'domcontentloaded' });

            const imgUrl = await page.evaluate(() => {
                const imgs = Array.from(document.querySelectorAll('img'));
                for (const img of imgs) {
                    // Give DOM a tiny moment to calculate sizes
                    const rect = img.getBoundingClientRect();
                    if (rect.width > 80 && rect.height > 80 && img.src && (img.src.startsWith('http') || img.src.startsWith('data:image'))) {
                        return img.src;
                    }
                }
                return null;
            });

            if (imgUrl) {
                console.log(`   Found match: ${imgUrl.substring(0, 60)}...`);
                // Base64 images from google start with data:image/jpeg;base64,
                const cleanName = prod.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.jpg';
                const destPath = path.join('C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/public/images', cleanName);

                if (imgUrl.startsWith('data:image')) {
                    const base64Data = imgUrl.replace(/^data:image\/jpeg;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    fs.writeFileSync(destPath, buffer);
                } else {
                    const viewSource = await page.goto(imgUrl);
                    const buffer = await viewSource.buffer();
                    fs.writeFileSync(destPath, buffer);
                }

                const stats = fs.statSync(destPath);

                if (stats.size > 1000) {
                    console.log(`   Saved ${cleanName} (${Math.round(stats.size / 1024)}KB)`);
                    const newWebPath = `/images/${cleanName}`;
                    if (prod.currentImageLoc !== newWebPath) {
                        replacements.push({ old: prod.currentImageLoc, new: newWebPath });
                    }
                } else {
                    console.log(`   Image too small.`);
                }
            } else {
                console.log(`   No image found.`);
            }
        } catch (e) {
            console.error(`   Error: ${e.message}`);
        }
        await page.close();
        await new Promise(r => setTimeout(r, 800)); // Delay to prevent captcha
    }

    await browser.close();

    console.log(`Updating Astro files...`);
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
    console.log('Done!');
})();
