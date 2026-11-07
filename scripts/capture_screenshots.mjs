import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const screenshotsDir = path.resolve(__dirname, '../docs/screenshots');
const brainScreenshotsDir = 'C:\\Users\\Ryzen 5\\.gemini\\antigravity\\brain\\c4a31db5-4689-4440-acee-871b86a26028\\screenshots';

fs.mkdirSync(screenshotsDir, { recursive: true });
fs.mkdirSync(brainScreenshotsDir, { recursive: true });

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let parsedUrl = new URL(req.url, 'http://localhost');
  let pathname = parsedUrl.pathname;
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  } else if (!path.extname(pathname)) {
    pathname += '/index.html';
  }

  let filePath = path.join(distDir, pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, '404.html');
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(5173, async () => {
  console.log('Static server running on http://localhost:5173');

  try {
    const browser = await chromium.launch({ headless: true });

    const viewports = [
      { name: 'home_desktop', width: 1280, height: 800, fullPage: false },
      { name: 'home_desktop_full', width: 1280, height: 800, fullPage: true },
      { name: 'home_tablet', width: 768, height: 1024, fullPage: false },
      { name: 'home_mobile', width: 375, height: 812, fullPage: false },
      { name: 'services_desktop', path: '/servicios/', width: 1280, height: 800, fullPage: false }
    ];

    for (const vp of viewports) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2
      });

      const url = `http://localhost:5173${vp.path || '/'}`;
      console.log(`Navigating to ${url} with viewport ${vp.width}x${vp.height}...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const localPath = path.join(screenshotsDir, `${vp.name}.png`);
      const brainPath = path.join(brainScreenshotsDir, `${vp.name}.png`);

      await page.screenshot({ path: localPath, fullPage: vp.fullPage });
      fs.copyFileSync(localPath, brainPath);

      console.log(`Saved screenshot: ${localPath} and ${brainPath}`);
      await page.close();
    }

    await browser.close();
    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
