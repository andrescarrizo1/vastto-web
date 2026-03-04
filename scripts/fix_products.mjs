import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real data scraped from Mercado Libre via browser
const products = [
    { slug: 'sony-wh-1000xm5-noise-cancelling', url: 'https://www.mercadolibre.com.ar/auriculares-bluetooth-sony-inalambricos-wh-1000xm5-color-negro/p/MLA19176887', img: 'https://http2.mlstatic.com/D_Q_NP_2X_668852-MLU78281656322_082024-F.webp' },
    { slug: 'soundpeats-clear-in-ear', url: 'https://www.mercadolibre.com.ar/soundpeats-c30-hybrid-noise-cancelling-bluetooth-earphones/p/MLA2048863874', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_647421-CBT100410436132_122025-F.webp' },
    { slug: 'jbl-wave-flex-tws', url: 'https://www.mercadolibre.com.ar/auricular-jbl-wave-flex-in-ear-inalambrico-negro/p/MLA24649805', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_631826-MLA100045821489_122025-F.webp' },
    { slug: 'haylou-gt1-2022', url: 'https://www.mercadolibre.com.ar/auriculares-bluetooth-gamer-inalambricos-haylou-gt1-pro-negro/p/MLA15466444', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_966643-MLU72581300932_112023-F.webp' },
    { slug: 'motorola-edge-40-neo-256gb', url: 'https://www.mercadolibre.com.ar/motorola-edge-40-neo-5g-256-gb-verde-8-gb-ram/p/MLA29349459', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_990978-MLA99928676441_112025-F.webp' },
    { slug: 'samsung-galaxy-a35-5g-128gb', url: 'https://www.mercadolibre.com.ar/samsung-galaxy-a35-5g-128gb-awesome-navy-8gb-ram/p/MLA38284735', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_701122-MLA99976493465_112025-F.webp' },
    { slug: 'xiaomi-poco-x6-pro-512gb', url: 'https://www.mercadolibre.com.ar/xiaomipocopoco-x6-pro-5g-dual-sim-512-gb-negro12-gb-ram/p/MLA29734176', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_669118-MLA99958088559_112025-F.webp' },
    { slug: 'iphone-13-128gb-midnight', url: 'https://www.mercadolibre.com.ar/iphone-13-128-gb-4-gb-ram-blanco-estelar-apple-distribuidor-autorizado/p/MLA1018500855', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_787642-MLA95698363690_102025-F.webp' },
    { slug: 'huawei-band-8', url: 'https://www.mercadolibre.com.ar/pantalla-huawei-band-band-10-de-147-pulgadas-con-correa-de-fluoroelastomero/p/MLA49735120', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_919058-MLA104669489859_012026-F.webp' },
    { slug: 'amazfit-gtr-4', url: 'https://www.mercadolibre.com.ar/smartwatch-amazfit-gtr-4-reloj-inteligente-gps-fitness-6pd-super-speed-black/p/MLA19758788', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_866785-MLA94331639241_102025-F.webp' },
    { slug: 'kieslect-ks-pro-llamadas', url: 'https://www.mercadolibre.com.ar/smartwatch-reloj-inteligente-kieslect-ks-pro-negro-con-pantalla-201-con-2-correas/p/MLA25868568', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_625799-MLA99487054208_112025-F.webp' },
    { slug: 'apple-watch-se-2nd-gen-40mm', url: 'https://www.mercadolibre.com.ar/apple-watch-se-gps-caja-de-aluminio-color-medianoche-de-40-mm-correa-deportiva-color-medianoche-sm/p/MLA27366067', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_671038-MLA99514988900_112025-F.webp' },
    { slug: 'cargador-baseus-65w-gan', url: 'https://www.mercadolibre.com.ar/cargador-65w-gan-ultra-carga-rapida-alta-calidad/up/MLAU3248243509', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_985696-MLA101425513047_122025-F.webp' },
    { slug: 'auriculares-vincha-logitech-g733-lightspeed', url: 'https://www.mercadolibre.com.ar/auriculares-gamer-inalambricos-logitech-g-series-g733-negro-con-luz-rgb-led/p/MLA16269735', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_712052-MLA99943901743_112025-F.webp' },
    { slug: 'powerbank-xiaomi-20000mah-18w', url: 'https://www.mercadolibre.com.ar/cargador-portatil-xiaomi-redmi-20000mah-carga-rapida-18w-color-negro/p/MLA21029066', img: 'https://http2.mlstatic.com/D_NQ_NP_2X_917270-MLA99522154520_122025-F.webp' }
];

async function run() {
    const imagesDir = path.join(__dirname, '..', 'public', 'images');

    // 1. Download real images
    console.log('=== Downloading real product images ===');
    for (const prod of products) {
        const filepath = path.join(imagesDir, `${prod.slug}.jpg`);
        try {
            const response = await fetch(prod.img);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
            console.log(`✅ ${prod.slug}`);
        } catch (err) {
            console.error(`❌ ${prod.slug}: ${err.message}`);
        }
    }

    // 2. Update URLs in [categoria].astro
    console.log('\n=== Updating product URLs in [categoria].astro ===');
    const astroPath = path.join(__dirname, '..', 'src', 'pages', '[categoria].astro');
    let content = fs.readFileSync(astroPath, 'utf8');

    for (const prod of products) {
        // Find the old search URL pattern for this product
        const oldUrlPattern = `https://www.mercadolibre.com.ar/jm/search?as_word=${encodeURIComponent(prod.slug.replace(/-/g, ' ').replace(/\d+/g, '').trim()).replace(/%20/g, '%20')}`;

        // More reliable: search by image path which is unique
        const imageRef = `/images/${prod.slug}.jpg`;
        const regex = new RegExp(`(image:\\s*['"]${imageRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"],\\s*\\n\\s*url:\\s*['"])([^'"]+)(['"])`);

        if (regex.test(content)) {
            content = content.replace(regex, `$1${prod.url}$3`);
            console.log(`✅ Updated URL for ${prod.slug}`);
        } else {
            // Try a simpler approach: find any URL near the image path
            const simpleRegex = new RegExp(`("image":\\s*"${imageRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",\\s*\\n\\s*"url":\\s*")([^"]+)(")`);
            if (simpleRegex.test(content)) {
                content = content.replace(simpleRegex, `$1${prod.url}$3`);
                console.log(`✅ Updated URL for ${prod.slug} (JSON format)`);
            } else {
                console.warn(`⚠️ Could not find URL pattern for ${prod.slug}, will try broader search...`);
            }
        }
    }

    fs.writeFileSync(astroPath, content);
    console.log('\n✅ Done updating [categoria].astro');
}

run();
