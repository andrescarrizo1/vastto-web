import fs from 'fs';
import path from 'path';

function processAstroFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /image:\s*'(\/images\/[^']+)',\s*\n\s*url:\s*'([^']+)'/g;
    let match;
    const products = [];
    while ((match = regex.exec(content)) !== null) {
        products.push({
            currentImageLoc: match[1],
            url: match[2]
        });
    }
    return products;
}

async function extractMlaId(url) {
    if (url.includes('/p/MLA')) {
        return url.split('/p/')[1].split('?')[0];
    } else if (url.includes('-MLA')) {
        const match = url.match(/-MLA(\d+)/);
        if (match) return `MLA${match[1]}`;
    } else if (url.includes('MLA-')) {
        const match = url.match(/MLA-(\d+)/);
        if (match) return `MLA${match[1]}`;
    }
    return null;
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

    let replacements = [];

    async function downloadImage(imgUrl, prod) {
        const filename = imgUrl.split('/').pop();
        const destPath = path.join('C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/public/images', filename);

        try {
            const res = await fetch(imgUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                }
            });
            const buffer = await res.arrayBuffer();
            fs.writeFileSync(destPath, Buffer.from(buffer));
            const stats = fs.statSync(destPath);
            console.log(`   Downloaded ${filename} (${stats.size} bytes)`);

            if (prod.currentImageLoc !== `/images/${filename}`) {
                replacements.push({ old: prod.currentImageLoc, new: `/images/${filename}` });
            }
        } catch (e) {
            console.log(`   Failed downloading image: ${e.message}`);
        }
    }

    for (const prod of products) {
        const id = await extractMlaId(prod.url);
        if (!id) { console.log(`Could not get ID for ${prod.url}`); continue; }

        console.log(`Processing ${id}...`);
        try {
            // First try products API
            const resProd = await fetch(`https://api.mercadolibre.com/products/${id}`);
            let found = false;
            if (resProd.ok) {
                const dataProd = await resProd.json();
                if (dataProd.pictures && dataProd.pictures.length > 0) {
                    await downloadImage(dataProd.pictures[0].url, prod);
                    found = true;
                }
            }

            if (!found) {
                const res = await fetch(`https://api.mercadolibre.com/items/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.pictures && data.pictures.length > 0) {
                        await downloadImage(data.pictures[0].secure_url, prod);
                    } else {
                        console.log(`   No pictures found in API for ${id}`);
                    }
                } else {
                    console.log(`   API returned ${res.status} for ${id}`);
                }
            }
        } catch (e) {
            console.log(`   Err: ${e.message}`);
        }
    }

    // update files
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
