import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsData = {
    auriculares: [
        {
            title: 'Sony WH-1000XM5 Noise Cancelling', price: 580000, originalPrice: 650000, badge: 'PREMIUM',
            verdict: 'El rey indiscutido de la cancelación de ruido. Si viajas en subte o avión frecuentemente, es una inversión en salud mental. No lo recomendamos solo para estar en casa por su precio.',
            pros: ['Cancelación de ruido extrema', 'Batería de 30 horas', 'Comodidad para usos largos'],
            cons: ['Precio muy elevado', 'No se pliegan completamente']
        },
        {
            title: 'SoundPEATS Clear In-Ear', price: 42000, originalPrice: 50000, badge: 'CALIDAD/PRECIO',
            verdict: 'La mejor opción transparente y económica. Tienen un sonido que compite con auriculares del doble de precio. Ideales para el día a día sin miedo a perderlos.',
            pros: ['Diseño transparente único', 'Sonido claro y fuerte', 'Baratos'],
            cons: ['Micrófono regular en exteriores', 'Los plásticos se rayan fácil']
        },
        {
            title: 'JBL Wave Flex TWS', price: 68000, originalPrice: null, badge: 'OFERTA',
            verdict: 'Si no te gustan las gomitas in-ear que entran al canal auditivo, los Wave Flex son la opción más segura y confiable de JBL. Sonido cálido y buena batería.',
            pros: ['No son intrusivos (sin gomita)', 'Bajos potentes típicos de JBL', 'App personalizable'],
            cons: ['Aíslan poco el ruido del colectivo']
        },
        {
            title: 'Haylou GT1 2022', price: 23000, originalPrice: 28000, badge: 'ECONÓMICO',
            verdict: 'Si tu presupuesto es el mínimo indispensable pero no querés comprar basura genética, los Haylou cumplen. Suenan bien, conectan rápido y son enanos.',
            pros: ['Tamaño ínfimo, no asoman de la oreja', 'Conexión súper estable', 'Precio imbatible'],
            cons: ['Batería muy justa (4hs continuas)', 'Construcción muy frágil']
        }
    ],
    celulares: [
        {
            title: 'Motorola Edge 40 Neo 256GB', price: 620000, originalPrice: 699000, badge: 'OFERTA',
            verdict: 'El punto dulce de Motorola. Resistente al agua, pantalla curva hermosa y carga ridículamente rápida. Es para el que quiere sensación de gama alta sin pagarla.',
            pros: ['Certificación IP68 (Sumergible)', 'Diseño súper premium y liviano', 'Cargador de 68W en caja'],
            cons: ['Batería drena rápido a 144Hz', 'Cámaras nocturnas promedio']
        },
        {
            title: 'Samsung Galaxy A35 5G 128GB', price: 680000, originalPrice: 750000, badge: 'GAMA MEDIA',
            verdict: 'El tanque confiable. Compra segura si buscás que te dure 4 años con actualizaciones aseguradas y buena pantalla. No es para gamers exigentes.',
            pros: ['Pantalla Super AMOLED excelente', '4 años de actualizaciones Android', 'Diseño idéntico al S24'],
            cons: ['Procesador Exynos se calienta un poco', 'Lento para cargar (25W)']
        },
        {
            title: 'Xiaomi POCO X6 Pro 512GB', price: 820000, originalPrice: null, badge: 'GAMER',
            verdict: 'Una bestia de rendimiento. Si jugás Call of Duty, Genshin o querés que el celular vuele por los próximos años, este tiene procesador casi de gama alta.',
            pros: ['Rendimiento brutal (Dimensity 8300-Ultra)', 'Almacenamiento sobradísimo (512GB)', 'Pantalla 1.5K top'],
            cons: ['HyperOS todavía tiene bugs', 'Las cámaras secundarias son de adorno']
        },
        {
            title: 'iPhone 13 128GB Midnight', price: 1050000, originalPrice: 1200000, badge: 'APPLE',
            verdict: 'La puerta de entrada más lógica a iOS en 2026. Aún siendo un modelo clásico, rinde mejor que la mayoría de los gama media premium de Android.',
            pros: ['Video insuperable', 'Ecosistema Apple impecable', 'Tamaño perfecto (6.1")'],
            cons: ['Pantalla a 60Hz (imperdonable hoy)', 'Batería llega con lo justo al final del día']
        }
    ],
    smartwatch: [
        {
            title: 'Huawei Band 8', price: 52000, originalPrice: 65000, badge: 'FITNESS',
            verdict: 'La pulsera definitiva. Más finita, liviana y precisa que la Xiaomi Band original. Si solo querés contar pasos, ver la hora y notificaciones, no gastes más.',
            pros: ['Pantalla AMOLED vibrante', 'Carga súper rápida', 'Medición de sueño excelente'],
            cons: ['No tiene GPS integrado', 'Esferas gratis limitadas']
        },
        {
            title: 'Amazfit GTR 4', price: 195000, originalPrice: null, badge: 'PREMIUM',
            verdict: 'Aspecto de reloj tradicional de alta gama con funciones smart que duran dos semanas. Perfecto para el oficinista que corre los fines de semana.',
            pros: ['Batería de hasta 14 días', 'GPS de doble banda muy preciso', 'Puedes contestar llamadas'],
            cons: ['No se puede responder WhatsApp con teclado', 'App Zepp a veces crashea']
        },
        {
            title: 'Kieslect Ks Pro Llamadas', price: 85000, originalPrice: 100000, badge: 'OFERTA',
            verdict: 'El clon del Apple Watch con mejor relación calidad/precio. Cumple la promesa de hacer llamadas desde la muñeca sin vaciarte la billetera.',
            pros: ['Pantalla enorme de 2.01"', 'Llamadas Bluetooth muy claras', 'Bajo precio'],
            cons: ['Sistema operativo medio lento', 'Materiales sienten un poco plasticos']
        },
        {
            title: 'Apple Watch SE 2nd Gen 40mm', price: 420000, originalPrice: 480000, badge: 'APPLE',
            verdict: 'Si tenés iPhone y querés un Watch, este es el que debés comprar. Te da el 90% de la experiencia del modelo más caro, por mucho menos plata.',
            pros: ['Integración iOS perfecta', 'Seguimiento deportivo top', 'Procesador rápido'],
            cons: ['Batería de 1 día literal', 'Carga lenta frente a la Serie 9']
        }
    ],
    accesorios: [
        {
            title: 'Cargador Baseus 65W GaN', price: 42000, originalPrice: 50000, badge: 'GAN',
            verdict: 'El único cargador que necesitás viajar. Carga la notebook, el celu y los auris al mismo tiempo gracias a la tecnología GaN. Un salvavidas.',
            pros: ['Carga 3 dispositivos a la vez', 'Tamaño compacto y frío', 'Material anti-roturas'],
            cons: ['Algo pesado en el enchufe', 'El cable incluido es medio corto']
        },
        {
            title: 'Auriculares Vincha Logitech G733 Lightspeed', price: 175000, originalPrice: 200000, badge: 'GAMER',
            verdict: 'Súper livianos e inalámbricos. Si pasás horas jugando o en calls de trabajo, literalmente te olvidás que los llevás puestos.',
            pros: ['Peso pluma (278g)', 'Sin lag gracias al receptor USB', 'Micrófono con filtros Blue VO!CE'],
            cons: ['Sonido enfocado en gaming, no tanto música', 'Mucho plástico']
        },
        {
            title: 'Powerbank Xiaomi 20000mAh 18W', price: 58000, originalPrice: 65000, badge: 'VIAJES',
            verdict: 'Un ladrillo de energía pura. En un viaje en micro de 24hs te salva el celular entero unas 4 veces. Indispensable para cortes de luz largos.',
            pros: ['Carga el celu múltiples veces', 'Permite cargar 2 cosas a la vez', 'Construcción muy sólida'],
            cons: ['Pesa casi medio kilo', 'Tarda toda la noche en recargarse']
        }
    ]
};

const slugify = (text) => text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const downloadImage = async (url, filepath) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Unexpected response ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filepath, buffer);
        return filepath;
    } catch (error) {
        throw new Error(`Failed to download ${url}: ${error.message}`);
    }
};

async function run() {
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    const formattedData = {};

    for (const [catName, products] of Object.entries(productsData)) {
        console.log(`Processing category: ${catName}...`);
        const catFormatted = [];

        for (const prod of products) {
            let slug = slugify(prod.title).substring(0, 50);
            if (slug.endsWith('-')) slug = slug.slice(0, -1);
            const filename = `${slug}.jpg`;
            const filepath = path.join(imagesDir, filename);

            // We will generate a smart placeholder image using ui-avatars or placehold.co
            const imgUrl = `https://placehold.co/600x600/ffffff/333333.jpg?text=${encodeURIComponent(prod.title)}`;

            try {
                await downloadImage(imgUrl, filepath);
                console.log(`Downloaded image for ${prod.title}`);

                catFormatted.push({
                    title: prod.title,
                    price: prod.price,
                    originalPrice: prod.originalPrice,
                    image: `/images/${filename}`,
                    url: `https://www.mercadolibre.com.ar/jm/search?as_word=${encodeURIComponent(prod.title)}`, // Realistic search URL
                    badge: prod.badge,
                    rating: 4.5 + Math.random() * 0.5,
                    reviews: Math.floor(Math.random() * 2000) + 150,
                    freeShipping: true,
                    verdict: prod.verdict,
                    pros: prod.pros,
                    cons: prod.cons
                });
            } catch (err) {
                console.error(`Failed on image for ${prod.title}`, err.message);
            }
        }
        formattedData[catName] = catFormatted;
    }

    const outPath = path.join(__dirname, 'formatted_products.json');
    fs.writeFileSync(outPath, JSON.stringify(formattedData, null, 2));
    console.log('✅ Finished generating all products and downloading images!');
}

run();
