import fs from 'fs';
import path from 'path';
import https from 'https';

const products = [
    {
        "category": "celulares",
        "title": "Motorola Moto G15 8GB/256GB Dual Sim Gris",
        "price": 319900,
        "originalPrice": 359000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_960538-MLA740103544-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/motorola-moto-g15-8gb256gb-negro/p/MLA50877644"
    },
    {
        "category": "celulares",
        "title": "Xiaomi Redmi 15C 128GB 8GB RAM Dual Sim",
        "price": 214000,
        "originalPrice": 268800,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_821035-MLA54103543-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/xiaomi-redmi-15c-128gb-8gb-ram-44-gb-color-negro-dual-sim/p/MLA54103543"
    },
    {
        "category": "celulares",
        "title": "Samsung Galaxy A56 5G 128 GB 8 GB RAM Negro",
        "price": 476717,
        "originalPrice": 529900,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_651035-MLA47115035-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/samsung-galaxy-a56-5g-128-gb-8-gb-ram-negro/p/MLA47115035"
    },
    {
        "category": "celulares",
        "title": "Xiaomi Redmi 14C 128GB 8GB RAM Negro",
        "price": 189513,
        "originalPrice": null,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_701035-MLA40103544-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/xiaomi-redmi-14c-128gb-8gb-ram-negro/p/MLA40103544"
    },
    {
        "category": "celulares",
        "title": "Xiaomi Redmi Note 14 4G 256GB 8GB RAM 108mpx",
        "price": 509900,
        "originalPrice": 589000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_881035-MLA3453043623-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/xiaomi-redmi-note-14-4g-256gb-8gb-ram/p/MLA3453043623"
    },
    {
        "category": "celulares",
        "title": "ZTE Blade A55 Black 128GB",
        "price": 169999,
        "originalPrice": 215260,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_901035-MLA42103545-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/celular-zte-blade-a55-black/p/MLA42103545"
    },
    {
        "category": "celulares",
        "title": "Samsung Galaxy A06 128GB Negro 6GB RAM",
        "price": 302067,
        "originalPrice": null,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_991035-MLA48946861-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/samsung-galaxy-a06-128gb-negro/p/MLA48946861"
    },
    {
        "category": "celulares",
        "title": "Samsung Galaxy S24 FE 256GB Negro",
        "price": 949000,
        "originalPrice": 1050000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_551035-MLA3453043624-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/samsung-galaxy-s24-fe-256gb-negro/p/MLA3453043624"
    },
    {
        "category": "celulares",
        "title": "Xiaomi 14T Pro 512GB Negro",
        "price": 899000,
        "originalPrice": null,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_441035-MLA4353043625-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/xiaomi-14t-pro-512gb-negro/p/MLA4353043625"
    },
    {
        "category": "auriculares",
        "title": "Sony WH-CH520 Auriculares Inalámbricos Bluetooth",
        "price": 87999,
        "originalPrice": 105000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_221035-MLA22103546-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/auriculares-sony-wh-ch520-inalambricos/p/MLA22103546"
    },
    {
        "category": "auriculares",
        "title": "Lenovo Thinkplus XT80 Running Bluetooth",
        "price": 59999,
        "originalPrice": 75000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_241035-MLA24531567-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/auricular-lenovo-thinkplus-xt80/p/MLA24531567"
    },
    {
        "category": "auriculares",
        "title": "Aiwa AW-BT301 Auriculares Bluetooth",
        "price": 38196,
        "originalPrice": 45000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_251035-MLA25103547-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/auriculares-aiwa-aw-bt301/p/MLA25103547"
    },
    {
        "category": "smartwatch",
        "title": "Garmin Forerunner 55 Negro Smartwatch",
        "price": 309193,
        "originalPrice": 350000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_181035-MLA18347134-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/smartwatch-forerunner-55-negro-garmin/p/MLA18347134"
    },
    {
        "category": "smartwatch",
        "title": "Xiaomi Watch S4 Black Smartwatch",
        "price": 244519,
        "originalPrice": 299000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_471035-MLA47043523-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/xiaomi-watch-s4-black/p/MLA47043523"
    },
    {
        "category": "smartwatch",
        "title": "Huawei Band 9 Negro",
        "price": 69999,
        "originalPrice": 85000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_491035-MLA49103548-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/huawei-band-9-negro/p/MLA49103548"
    },
    {
        "category": "smartwatch",
        "title": "Samsung Galaxy Watch 7 Silver",
        "price": 429999,
        "originalPrice": 499000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_501035-MLA50103549-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/samsung-galaxy-watch-7-silver/p/MLA50103549"
    },
    {
        "category": "smartwatch",
        "title": "Apple Watch Series 10 Space Black",
        "price": 849999,
        "originalPrice": 950000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_511035-MLA51103550-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/apple-watch-series-10-black/p/MLA51103550"
    },
    {
        "category": "accesorios",
        "title": "Funda Silicona Case iPhone 15 Pro Max",
        "price": 11999,
        "originalPrice": 15000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_521035-MLA52103551-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/funda-iphone-15-pro-max-silicona/p/MLA52103551"
    },
    {
        "category": "accesorios",
        "title": "Cargador Samsung 25W Rapido Sin Cable Original",
        "price": 28321,
        "originalPrice": 35000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_531035-MLA53103552-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/cargador-samsung-25w-sin-cable/p/MLA53103552"
    },
    {
        "category": "accesorios",
        "title": "Cable Apple Original USB-C a Lightning 1m",
        "price": 8978,
        "originalPrice": 12000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_541035-MLA54103553-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/cable-apple-usb-c-a-lightning/p/MLA54103553"
    },
    {
        "category": "accesorios",
        "title": "Soporte Celular Auto Imantado Universal",
        "price": 5499,
        "originalPrice": null,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_551035-MLA55103554-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/soporte-celular-auto-imantado/p/MLA55103554"
    },
    {
        "category": "accesorios",
        "title": "Vidrio Templado 9H Redmi Note 13",
        "price": 3864,
        "originalPrice": null,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_561035-MLA56103555-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/vidrio-templado-redmi-note-13/p/MLA56103555"
    },
    {
        "category": "accesorios",
        "title": "Aro de Luz LED 26cm con Tripode 2m",
        "price": 15900,
        "originalPrice": 22000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_571035-MLA57103556-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/aro-de-luz-led-con-tripode/p/MLA57103556"
    },
    {
        "category": "accesorios",
        "title": "Micrófono Corbatero Inalámbrico para Celular K9",
        "price": 12500,
        "originalPrice": 18000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_581035-MLA58103557-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/microfono-corbatero-inalambrico/p/MLA58103557"
    },
    {
        "category": "accesorios",
        "title": "Teclado Mecánico Redragon Kumara K552 RGB",
        "price": 49900,
        "originalPrice": 62000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_591035-MLA59103558-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/teclado-redragon-kumara-k552/p/MLA59103558"
    },
    {
        "category": "accesorios",
        "title": "Mouse Gamer Logitech G305 Lightspeed",
        "price": 72342,
        "originalPrice": 85000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_601035-MLA11259956-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/mouse-gamer-logitech-serie-g-lightspeed-g305-white/p/MLA11259956"
    },
    {
        "category": "accesorios",
        "title": "Webcam Logitech C920 Full HD 1080p",
        "price": 105136,
        "originalPrice": 120000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_611035-MLA18932026-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/camara-web-logitech-c920-full-hd-30fps-color-negro/p/MLA18932026"
    },
    {
        "category": "accesorios",
        "title": "Soporte Notebook Aluminio Plegable",
        "price": 9999,
        "originalPrice": 15000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_621035-MLA62103561-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/soporte-notebook-aluminio/p/MLA62103561"
    },
    {
        "category": "accesorios",
        "title": "Hub USB-C 7 en 1 Aluminio HDMI SD USB 3.0",
        "price": 33042,
        "originalPrice": 45000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_631035-MLA46745413-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/adaptador-hub-aluminio-usb-c-multifuncional-7-en-1-mac-pc/p/MLA46745413"
    },
    {
        "category": "accesorios",
        "title": "Mochila Urbana Tedge Antirrobo 35L Gris",
        "price": 39999,
        "originalPrice": 52000,
        "imageURL": "https://http2.mlstatic.com/D_NQ_NP_641035-MLA21283923-O.jpg",
        "productURL": "https://www.mercadolibre.com.ar/mochila-porta-notebook-tedge-antirrobo-color-gris-oscuro-35l/p/MLA21283923"
    }
];

const imagesDir = 'C:/Users/Ryzen 5/Documents/hunter_local_leads/vastto-web-main/public/images';

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(dest))
                    .on('error', reject)
                    .once('close', () => resolve(dest));
            } else {
                res.resume();
                reject(new Error(`Request failed with status code ${res.statusCode}`));
            }
        });
    });
}

async function run() {
    for (const product of products) {
        const filename = path.basename(product.imageURL);
        const dest = path.join(imagesDir, filename);

        if (fs.existsSync(dest)) {
            console.log(`Skipping ${filename}, already exists.`);
            continue;
        }

        try {
            await downloadImage(product.imageURL, dest);
            console.log(`Downloaded ${filename}`);
        } catch (err) {
            console.error(`Error downloading ${product.imageURL}: ${err.message}`);
        }
    }
}

run();
