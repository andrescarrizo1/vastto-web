import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const FILES = ['src/pages/index.astro', 'src/pages/[categoria].astro'];
const IMAGES_DIR = 'public/images';

if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function scrapeImages() {
    console.log('Starting Headless Browser (Puppeteer) to bypass ML protections...');
    // Use headless "new" and random UA to mimic a genuine user.
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Override webdriver to pass casual bot tests
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    for (const file of FILES) {
        const fullPath = path.resolve(file);
        if (!fs.existsSync(fullPath)) continue;

        let content = fs.readFileSync(fullPath, 'utf-8');

        // Find all ML URLs
        const urlRegex = /url:\s*['"](https:\/\/(?:www\.)?mercadolibre\.com\.ar\/[^'"]+)['"]/g;
        const matches = [...content.matchAll(urlRegex)];

        for (const match of matches) {
            const productUrl = match[1];
            console.log(`\nAnalyzing product: ${productUrl.split('/').pop()}`);

            try {
                await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

                // ML's DOM structure
                const imageUrl = await page.evaluate(() => {
                    // 1. Try to get the big gallery image
                    let img = document.querySelector('img.ui-pdp-image.ui-pdp-gallery__figure__image');
                    if (img && img.src) return img.src;
                    // 2. Fallback to OpenGraph meta tag
                    let og = document.querySelector('meta[property="og:image"]');
                    if (og && og.content) return og.content;
                    return null;
                });

                if (!imageUrl) {
                    console.log(`\u274C Could not find image URL.`);
                    continue;
                }

                console.log(`Found image: ${imageUrl}`);
                const filename = imageUrl.split('/').pop().split('?')[0];
                const destPath = path.join(IMAGES_DIR, filename);

                if (!fs.existsSync(destPath) || fs.statSync(destPath).size < 100000) {
                    // Use a new tab just to grab the image byte buffer in the same context
                    const imgPage = await browser.newPage();
                    const viewSource = await imgPage.goto(imageUrl);
                    fs.writeFileSync(destPath, await viewSource.buffer());
                    await imgPage.close();

                    const stats = fs.statSync(destPath);
                    console.log(`\u2705 Downloaded & Saved locally: ${filename} (${Math.round(stats.size / 1024)} KB)`);
                } else {
                    console.log(`\u23E9 Already downloaded: ${filename}`);
                }

                // Update Astro file: Replace whatever image path is right above this URL with the new local path.
                const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Match: `image: 'ANY_STRING', \n  url: 'THIS_PRODUCT_URL'`
                const blockRegex = new RegExp(`image:\\s*['"][^'"]+['"],\\s*url:\\s*['"]${escapeRegExp(productUrl)}['"]`, 'g');
                content = content.replace(blockRegex, `image: '/images/${filename}',\n    url: '${productUrl}'`);

            } catch (err) {
                console.log(`\u274C Error processing: ${err.message}`);
            }
        }

        // Save updated Astro file
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`\n\u2728 Updated Astro template: ${file} to use local robust images.`);
    }

    await browser.close();
    console.log('\n--- Automation Complete ---');
}

scrapeImages().catch(console.error);
