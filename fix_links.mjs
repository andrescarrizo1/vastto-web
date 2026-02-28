import fs from 'fs';
import path from 'path';

const FILES = [
    'src/pages/index.astro',
    'src/pages/[categoria].astro',
];

// Map of broken URL to a new replacement URL 
// (If a specific product is dead, we link to a generic high-converting search or a similar verified product)
const URL_REPLACEMENTS = {
    // index.astro
    'https://www.mercadolibre.com.ar/teclado-gamer-mecanico-retroiluminado-rgb-switch-blue/p/MLA19426925': 'https://www.mercadolibre.com.ar/teclado-gamer-mecanico-t-dagger-bora-t-tgk315-retroiluminado-qwerty-espanol-latinoamerica-color-negro-con-luz-rgb-switch-outemu-blue/p/MLA15110196',

    'https://www.mercadolibre.com.ar/mouse-gamer-logitech-g203-lightsync-rgb-8000-dpi/p/MLA15900366': 'https://www.mercadolibre.com.ar/mouse-gamer-logitech-g-g203-lightsync-negro/p/MLA15900366', // Correcci\u00f3n de slug

    'https://www.mercadolibre.com.ar/auriculares-gamer-hyperx-cloud-stinger-core-xbox-ps4-pc/p/MLA15609816': 'https://www.mercadolibre.com.ar/auriculares-gamer-hyperx-cloud-stinger-core-black/p/MLA15609816', // Correcci\u00f3n de slug

    // [categoria].astro
    'https://www.mercadolibre.com.ar/samsung-galaxy-a15-6-gb-ram-128-gb-azul-negro/p/MLA36168782': 'https://www.mercadolibre.com.ar/samsung-galaxy-a15-5g-256-gb-azul-oscuro-8-gb-ram/p/MLA36168782', // Volvi\u00f3 a cambiar el titulo del slug

    'https://www.mercadolibre.com.ar/celular-moto-g54-5g/p/MLA29900423': 'https://www.mercadolibre.com.ar/motorola-moto-g54-5g-256-gb-azul-artico-8-gb-ram/p/MLA29900423',

    'https://www.mercadolibre.com.ar/smartwatch-amazfit-bip-5/p/MLA29878736': 'https://www.mercadolibre.com.ar/smartwatch-amazfit-bip-5-soft-black-191-caja-de-plastico/p/MLA29878736',

    'https://www.mercadolibre.com.ar/cargador-inalambrico-qi-15w/p/MLA18937481': 'https://www.mercadolibre.com.ar/cargador-inalambrico-samsung-carga-rapida-15w-original/p/MLA18937481'
};

function fixLinks() {
    let totalReplaced = 0;

    for (const file of FILES) {
        const filePath = path.resolve(file);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf-8');
        let fileReplaced = 0;

        for (const [brokenUrl, newUrl] of Object.entries(URL_REPLACEMENTS)) {
            if (content.includes(brokenUrl)) {
                content = content.replace(newUrl, brokenUrl); // In case it was already replaced
                content = content.replace(brokenUrl, newUrl);
                fileReplaced++;
                totalReplaced++;
                console.log(`Replaced in ${file}:\n- ${brokenUrl}\n+ ${newUrl}\n`);
            }
        }

        if (fileReplaced > 0) {
            fs.writeFileSync(filePath, content, 'utf-8');
        }
    }

    console.log(`Finished. Replaced ${totalReplaced} broken links.`);
}

fixLinks();
