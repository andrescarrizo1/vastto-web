import fs from 'fs';
import path from 'path';
import https from 'https';

const products = [
    // Auriculares
    { "title": "Xiaomi Redmi Buds 6 Play - Negro", "imageURL": 'https://http2.mlstatic.com/D_NQ_NP_2X_802305-MLA95679505222_102025-F.webp' }, // Redmi Buds
    { "title": "Samsung Galaxy Buds FE - Grafito", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_956913-MLA96144013345_102025-O.webp" },
    { "title": "HyperX Cloud Stinger 2 Core - Black", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_608332-MLA75034123583_112023-O.webp" },
    { "title": "Sony WH-CH520 Inalámbricos", "imageURL": 'https://http2.mlstatic.com/D_NQ_NP_2X_932176-MLA99502277578_112025-F.webp' }, // Sony
    { "title": "Lenovo Thinkplus XT80 Sport", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_821735-MLA74531567432_022024-O.webp" },
    { "title": "Aiwa AW-BT301 Black Series", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_751235-MLA75103547432_032024-O.webp" },
    { "title": "JBL Tune 510BT Wireless", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_710235-MLA45932026432_052021-O.webp" },

    // Celulares
    { "title": "Samsung Galaxy A15 128GB - Negro", "imageURL": "https://http2.mlstatic.com/D_Q_NP_739386-MLA93089018144_092025-O.webp" },
    { "title": "Motorola Moto G54 5G 256GB - Azul", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_954517-MLA75263280575_032024-O.webp" },
    { "title": "Motorola Moto G15 256GB - Gris", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_960538-MLA740103544_072024-O.webp" },
    { "title": "Xiaomi Redmi 13C 128GB - 8GB RAM", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_821035-MLA54103543_042024-O.webp" },
    { "title": "Samsung Galaxy A55 5G 128GB", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_651035-MLA74711503543_012024-O.webp" },
    { "title": "Xiaomi Redmi 14C 128GB - Negro", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_701035-MLA74010354432_112023-O.webp" },
    { "title": "Xiaomi Redmi Note 13 Pro 256GB", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_881035-MLA73453043623_102023-O.webp" },
    { "title": "ZTE Blade A55 128GB - Negro", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_901035-MLA74210354532_122023-O.webp" },
    { "title": "Samsung Galaxy S24 FE 256GB", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_551035-MLA73453043624_102023-O.webp" },
    { "title": "Xiaomi 14T Pro 512GB Extreme", "imageURL": 'https://http2.mlstatic.com/D_NQ_NP_2X_688124-MLA96868489273_102025-F.webp' }, // Xiaomi 14T Pro

    // Smartwatch
    { "title": "Xiaomi Redmi Watch 4 - Negro GPS", "imageURL": "https://http2.mlstatic.com/D_Q_NP_949531-MLA99521864140_122025-O.webp" },
    { "title": "Amazfit Bip 5 Soft Black 1.91\"", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_700284-MLA73126267022_112023-O.webp" },
    { "title": "Garmin Forerunner 55 - Negro", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_181035-MLA71834713432_062023-O.webp" },
    { "title": "Xiaomi Watch S4 Classic", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_471035-MLA74704352343_052024-O.webp" },
    { "title": "Huawei Band 9 Smart - Negro", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_849649-MLA74910354832_042024-O.webp" },
    { "title": "Samsung Galaxy Watch 7 44mm", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_501035-MLA75010354932_072024-O.webp" },
    { "title": "Apple Watch Series 10 Space Black", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_511035-MLA75110355032_092024-O.webp" },

    // Accesorios
    { "title": "Cargador Inalambrico Fast Charge 15W", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_679478-MLA79185515187_092024-O.webp" },
    { "title": "Funda Silicona iPhone 15 Pro Max", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_852135-MLA75210355132_102023-O.webp" },
    { "title": "Cargador Samsung Original 25W", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_853135-MLA75310355232_112023-O.webp" },
    { "title": "Cable Apple USB-C Lightning 1m", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_854135-MLA75410355332_012024-O.webp" },
    { "title": "Soporte Celular Magnético Universal", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_551035-MLA75510355443_022024-O.webp" },
    { "title": "Vidrio Templado 9H - Alta Resistencia", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_561035-MLA75610355532_032024-O.webp" },
    { "title": "Aro de Luz Professional 26cm", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_571035-MLA75710355632_042024-O.webp" },
    { "title": "Micrófono Corbatero K9 Inalámbrico", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_581035-MLA75810355732_052024-O.webp" },
    { "title": "Teclado Mecánico Redragon RGB", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_591035-MLA75910355832_062024-O.webp" },
    { "title": "Mouse Gamer Logitech G305 Wireless", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_601035-MLU11259956432_072024-O.webp" },
    { "title": "Webcam Logitech C920 Full HD", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_819320-MLA51893202643_082024-O.webp" },
    { "title": "Soporte Laptop Aluminio Premium", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_621035-MLA76210356132_092024-O.webp" },
    { "title": "Hub USB-C 7 en 1 Multi-puerto", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_467454-MLA44674541332_102024-O.webp" },
    { "title": "Mochila Urbana Tedge - Antirrobo", "imageURL": "https://http2.mlstatic.com/D_NQ_NP_212839-MLA52128392332_112024-O.webp" }
];

const imagesDir = 'C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/public/images';

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': 'https://www.mercadolibre.com.ar/',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        };

        https.get(url, options, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    const stats = fs.statSync(dest);
                    if (stats.size < 9000) { // El placeholder de ML mide ~8.4KB
                        console.log(`[!] WARN: ${path.basename(dest)} is very small (${stats.size} bytes). Likely a placeholder.`);
                    }
                    resolve(dest);
                });
            } else if (res.statusCode === 301 || res.statusCode === 302) {
                downloadImage(res.headers.location, dest).then(resolve).catch(reject);
            } else {
                res.resume();
                reject(new Error(`Status ${res.statusCode} for ${url}`));
            }
        }).on('error', reject);
    });
}

async function run() {
    console.log(`Starting download of ${products.length} images...`);
    for (const product of products) {
        const filename = path.basename(product.imageURL);
        const dest = path.join(imagesDir, filename);

        try {
            await downloadImage(product.imageURL, dest);
            console.log(`OK: ${filename}`);
        } catch (err) {
            console.error(`ERROR: ${product.title} (${product.imageURL}): ${err.message}`);
        }
    }
    console.log('Finished.');
}

run();
