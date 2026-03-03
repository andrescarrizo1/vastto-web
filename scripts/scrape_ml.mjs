import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Apply stealth plugin
const stealth = StealthPlugin();
puppeteer.use(stealth);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES = [
    { url: 'https://listado.mercadolibre.com.ar/auriculares-bluetooth#D[A:auriculares%20bluetooth]', key: 'auriculares', limit: 4 },
    { url: 'https://listado.mercadolibre.com.ar/celulares-smartphones-liberados_NoIndex_True#D[A:celulares]', key: 'celulares', limit: 4 },
    { url: 'https://listado.mercadolibre.com.ar/smartwatch#D[A:smartwatch]', key: 'smartwatch', limit: 4 },
    { url: 'https://listado.mercadolibre.com.ar/cargador-celular#D[A:cargador%20celular]', key: 'accesorios', limit: 3 }
];

const slugify = (text) => text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

async function run() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const allResults = {};

    for (const cat of CATEGORIES) {
        console.log(`Scraping category: ${cat.key}`);
        const page = await browser.newPage();
        await page.goto(cat.url, { waitUntil: 'load', timeout: 60000 });

        if (cat.key === 'auriculares') {
            const html = await page.content();
            fs.writeFileSync(path.join(__dirname, 'ml_dump.html'), html);
            console.log("Dumped HTML to ml_dump.html");
        }

        // Extract first N items
        const items = await page.evaluate((limit) => {
            const results = [];
            const cards = document.querySelectorAll('.ui-search-layout__item, .ui-search-result');
            for (const card of cards) {
                if (results.length >= limit) break;
                const titleEl = card.querySelector('h2');
                if (!titleEl) continue;
                const title = titleEl.innerText;

                const priceEl = card.querySelector('.andes-money-amount__fraction');
                const price = priceEl ? parseInt(priceEl.innerText.replace(/\./g, '')) : 0;

                const linkEl = card.querySelector('a.ui-search-link');
                const link = linkEl ? linkEl.href : '';

                // Fix image attribute grabbing structure
                const imgEl = card.querySelector('img');
                const imgSrc = imgEl ? (imgEl.getAttribute('data-src') || imgEl.getAttribute('src')) : '';

                if (title && price && link && imgSrc && !imgSrc.includes('data:image')) {
                    results.push({ title, price, url: link, imgSrc });
                }
            }
            return results;
        }, cat.limit);

        console.log(`Found ${items.length} items for ${cat.key}`);
        const catProducts = [];

        for (const item of items) {
            let slug = slugify(item.title);
            if (slug.length > 50) slug = slug.substring(0, 50);
            if (slug.endsWith('-')) slug = slug.slice(0, -1);
            const filename = `${slug}.jpg`;
            const filepath = path.join(__dirname, '..', 'public', 'images', filename);

            try {
                const imgRes = await fetch(item.imgSrc);
                if (!imgRes.ok) throw new Error("Fetch failed");
                const arrayBuffer = await imgRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                fs.writeFileSync(filepath, buffer);

                catProducts.push({
                    title: item.title,
                    price: item.price,
                    originalPrice: Math.floor(item.price * 1.15), // Mock 15% discount
                    image: `/images/${filename}`,
                    url: item.url,
                    badge: 'MÁS VENDIDO',
                    rating: 4.8,
                    reviews: Math.floor(Math.random() * 4000) + 100,
                    freeShipping: true
                });
            } catch (e) {
                console.error(`Failed to download image for ${item.title}:`, e.message);
            }
        }

        allResults[cat.key] = catProducts;
        await page.close();
    }

    await browser.close();
    const outPath = path.join(__dirname, 'new_products.json');
    fs.writeFileSync(outPath, JSON.stringify(allResults, null, 2));
    console.log(`Saved results to ${outPath}`);
}

run().catch(console.error);
