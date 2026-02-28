import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES_DIR = 'public/images';

// Helper to download an image following redirects
async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        let fileStream = null;

        const getReq = (currentUrl) => {
            https.get(currentUrl, (response) => {
                if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    // Handle redirect
                    getReq(response.headers.location);
                } else if (response.statusCode !== 200) {
                    reject(new Error(`Failed to get '${currentUrl}' (${response.statusCode})`));
                } else {
                    // Only create the file once we have a 200 OK response!
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

async function fixEmptyImages() {
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error("Images directory not found.");
        return;
    }

    const files = fs.readdirSync(IMAGES_DIR);
    let fixedCount = 0;

    for (const filename of files) {
        const destPath = path.join(IMAGES_DIR, filename);
        const stats = fs.statSync(destPath);

        if (stats.size === 0) {
            console.log(`\nFound 0-byte image: ${filename}`);

            // Delete the empty file
            fs.unlinkSync(destPath);

            // Attempt to download it again
            const mlUrl = `https://http2.mlstatic.com/${filename}`;
            console.log(`Attempting to download from ${mlUrl}`);

            try {
                await downloadImage(mlUrl, destPath);
                console.log(`Successfully downloaded ${filename}`);
                fixedCount++;
            } catch (err) {
                console.error(`Error downloading ${filename}: ${err.message}`);
            }
        }
    }

    console.log(`\nProcess completed. Fixed ${fixedCount} images.`);
}

fixEmptyImages().catch(console.error);
