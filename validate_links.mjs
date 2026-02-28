import fs from 'fs';
import path from 'path';
import https from 'https';

const ASTRO_FILES = [
    'src/pages/index.astro',
    'src/pages/[categoria].astro',
];

// Funci\u00f3n para validar si una URL est\u00e1 viva
function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            // 2xx y 3xx son v\u00e1lidos (ML suele redirigir 301/302 a veces)
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ url, status: res.statusCode, ok: true });
            } else {
                resolve({ url, status: res.statusCode, ok: false });
            }
        }).on('error', (err) => {
            resolve({ url, error: err.message, ok: false });
        });
    });
}

async function validateFileLinks(filePath) {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) return [];

    const content = fs.readFileSync(fullPath, 'utf-8');

    // Buscar las URLs de ML en el formato url: 'https://...'
    const urlRegex = /url:\s*['"](https:\/\/(?:www\.)?mercadolibre\.com\.ar\/[^'"]+)['"]/g;
    const urlMatches = [...content.matchAll(urlRegex)];

    const results = [];
    for (const match of urlMatches) {
        const mlUrl = match[1];
        console.log(`Checking: ${mlUrl}`);
        const result = await checkUrl(mlUrl);
        results.push(result);
    }

    return results;
}

async function main() {
    console.log('--- Validating Mercado Libre Links ---');
    let totalBroken = 0;

    for (const file of ASTRO_FILES) {
        console.log(`\nScanning file: ${file}`);
        const results = await validateFileLinks(file);

        for (const res of results) {
            if (!res.ok) {
                console.log(`\u274c BROKEN (Status ${res.status}): ${res.url}`);
                totalBroken++;
            } else {
                // console.log(`\u2705 OK (Status ${res.status}): ${res.url}`);
            }
        }
    }

    console.log(`\nValidation complete. Found ${totalBroken} broken links.`);
}

main().catch(console.error);
