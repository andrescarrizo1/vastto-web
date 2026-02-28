import fs from 'fs';
import path from 'path';
import https from 'https';

const ASTRO_FILES = [
    'src/pages/index.astro',
    'src/pages/[categoria].astro',
];

const IMAGES_DIR = 'public/images';

// Helper to download an image following redirects
async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        const getReq = (currentUrl) => {
            https.get(currentUrl, (response) => {
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    // Handle redirect
                    getReq(response.headers.location);
                } else if (response.statusCode !== 200) {
                    reject(new Error(`Failed to get '${currentUrl}' (${response.statusCode})`));
                } else {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close(resolve);
                    });
                }
            }).on('error', (err) => {
                fs.unlink(dest, () => reject(err));
            });
        };

        getReq(url);
    });
}

function sanitizeFilename(url) {
    const matches = url.match(/\/([^\/?#]+)[^\/]*$/);
    return matches ? matches[1] : `image_${Date.now()}.webp`;
}

async function processFile(filePath) {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
        console.log(`File not found: ${fullPath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    const imageRegex = /image:\s*['"](https:\/\/(?:http2\.)?mlstatic\.com\/[^'"]+)['"]/g;
    let modifications = 0;

    const urlMatches = [...content.matchAll(imageRegex)];

    for (const match of urlMatches) {
        const originalUrl = match[1];
        const filename = sanitizeFilename(originalUrl);
        const destPath = path.join(IMAGES_DIR, filename);
        const localUrl = `/images/${filename}`;

        try {
            if (!fs.existsSync(destPath)) {
                console.log(`Downloading: ${originalUrl}`);
                await downloadImage(originalUrl, destPath);
            } else {
                console.log(`Already exists: ${filename}`);
            }
            content = content.replace(originalUrl, localUrl);
            modifications++;
        } catch (e) {
            console.error(`Error processing ${originalUrl}:`, e.message);
        }
    }

    if (modifications > 0) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${modifications} images in ${filePath}`);
    } else {
        console.log(`No images updated in ${filePath}`);
    }
}

async function main() {
    if (!fs.existsSync(IMAGES_DIR)) {
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    for (const file of ASTRO_FILES) {
        console.log(`\nProcessing: ${file}`);
        await processFile(file);
    }

    console.log('\nImage localization complete!');
}

main().catch(console.error);
