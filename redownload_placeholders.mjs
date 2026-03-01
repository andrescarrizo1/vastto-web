import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES_DIR = 'public/images';

// We noticed file sizes of exactly 52473 and 22532 bytes are MercadoLibre's "Image Not Available" placeholders.
const PLACEHOLDER_SIZES = [52473, 22532];

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        let fileStream = null;

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7',
            }
        };

        const getReq = (currentUrl) => {
            https.get(currentUrl, options, (response) => {
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    getReq(response.headers.location);
                } else if (response.statusCode !== 200) {
                    reject(new Error(`Failed to get '${currentUrl}' (${response.statusCode})`));
                } else {
                    fileStream = fs.createWriteStream(dest);
                    response.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        resolve();
                    });
                }
            }).on('error', (err) => {
                if (fileStream) {
                    fileStream.close();
                    fs.unlink(dest, () => reject(err));
                } else {
                    reject(err);
                }
            });
        };

        getReq(url);
    });
}

async function fixPlaceholderImages() {
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error("Images directory not found.");
        return;
    }

    const files = fs.readdirSync(IMAGES_DIR);
    let fixedCount = 0;

    for (const filename of files) {
        const destPath = path.join(IMAGES_DIR, filename);
        const stats = fs.statSync(destPath);

        if (PLACEHOLDER_SIZES.includes(stats.size) || stats.size === 0) {
            console.log(`\nFound Placeholder Image (${stats.size} bytes): ${filename}`);

            // Delete the fake placeholder file
            fs.unlinkSync(destPath);

            // Attempt to download it again with proper headers
            const mlUrl = `https://http2.mlstatic.com/${filename}`;
            console.log(`Attempting to download REAL image from ${mlUrl}`);

            try {
                await downloadImage(mlUrl, destPath);

                // Verify we didn't just redownload the placeholder
                const newStats = fs.statSync(destPath);
                if (PLACEHOLDER_SIZES.includes(newStats.size)) {
                    console.log(`\u26A0\uFE0F Still resolving to placeholder. ML might be blocking or image is truly gone.`);
                } else {
                    console.log(`\u2705 Successfully downloaded REAL image: ${filename} (${newStats.size} bytes)`);
                    fixedCount++;
                }
            } catch (err) {
                console.error(`\u274C Error downloading ${filename}: ${err.message}`);
            }
        }
    }

    console.log(`\nProcess completed. Fixed ${fixedCount} placeholder images.`);
}

fixPlaceholderImages().catch(console.error);
