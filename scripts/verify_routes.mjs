import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve('dist');
const SCREENSHOTS_DIR = 'C:\\Users\\Ryzen 5\\.gemini\\antigravity\\brain\\c4a31db5-4689-4440-acee-871b86a26028\\screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Simple static server matching Cloudflare Pages behavior
const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(DIST_DIR, reqPath);

  // If path is a directory or ends with slash, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.xml': 'application/xml',
      '.txt': 'text/plain'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // 404 behavior: serve 404.html with status 404
    const notFoundPage = path.join(DIST_DIR, '404.html');
    if (fs.existsSync(notFoundPage)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(notFoundPage).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
});

const PORT = 4321;

const routesToTest = [
  { path: '/', name: 'Home' },
  { path: '/servicios', name: 'Servicios' },
  { path: '/automatizacion', name: 'Automatización' },
  { path: '/inteligencia-artificial', name: 'IA Aplicada' },
  { path: '/desarrollo', name: 'Desarrollo de Software' },
  { path: '/marketing-digital', name: 'Marketing & SEO' },
  { path: '/soluciones/inmobiliarias', name: 'Solución Inmobiliarias' },
  { path: '/soluciones/automotrices', name: 'Solución Automotrices' },
  { path: '/soluciones/distribuidoras', name: 'Solución Distribuidoras' },
  { path: '/demos', name: 'Catálogo de Demos' },
  { path: '/demos/inmobiliaria', name: 'Demo Inmobiliaria' },
  { path: '/demos/automotriz', name: 'Demo Automotriz' },
  { path: '/demos/automatizacion', name: 'Demo Automatización' },
  { path: '/proyectos', name: 'Portfolio de Proyectos' },
  { path: '/sobre-mi', name: 'Sobre Andrés Carrizo' },
  { path: '/contacto', name: 'Contacto' },
  { path: '/privacidad', name: 'Política de Privacidad' },
  { path: '/ruta-inexistente-404', name: 'Ruta Inexistente (404)' }
];

server.listen(PORT, async () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = [];

  for (const item of routesToTest) {
    const url = `http://localhost:${PORT}${item.path}`;
    let status = 0;
    let title = '';
    let canonical = '';
    let hasFakeWhatsApp = false;

    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      status = response.status();
      title = await page.title();
      
      const canonicalElem = await page.$('link[rel="canonical"]');
      if (canonicalElem) {
        canonical = await canonicalElem.getAttribute('href') || '';
      }

      // Check for any fake whatsapp number in the rendered DOM
      const pageText = await page.content();
      hasFakeWhatsApp = pageText.includes('5492604000000');

      // Screenshots
      if (item.path === '/') {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'iter2_home_desktop.png'), fullPage: false });
        
        // Mobile screenshot
        const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const mobilePage = await mobileContext.newPage();
        await mobilePage.goto(url, { waitUntil: 'domcontentloaded' });
        await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'iter2_home_mobile.png'), fullPage: false });
        await mobileContext.close();
      }

      if (item.path === '/soluciones/inmobiliarias') {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'iter2_inmobiliarias_desktop.png'), fullPage: false });
        
        // Mobile screenshot
        const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const mobilePage = await mobileContext.newPage();
        await mobilePage.goto(url, { waitUntil: 'domcontentloaded' });
        await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'iter2_inmobiliarias_mobile.png'), fullPage: false });
        await mobileContext.close();
      }

      const isOk = (item.path === '/ruta-inexistente-404' ? status === 404 : status === 200) && !hasFakeWhatsApp;

      results.push({
        path: item.path,
        name: item.name,
        status,
        title: title.trim(),
        canonical,
        fakeWhatsApp: hasFakeWhatsApp ? 'DETECTADO (ERROR)' : 'NINGUNO (Limpio)',
        result: isOk ? 'OK' : 'Requiere Ajuste'
      });
    } catch (err) {
      results.push({
        path: item.path,
        name: item.name,
        status: 'ERROR',
        title: err.message,
        canonical: '',
        fakeWhatsApp: 'N/A',
        result: 'ERROR'
      });
    }
  }

  await browser.close();
  server.close();

  console.log('\n--- RESULTADOS DE AUDITORÍA DE RUTAS PLAYWRIGHT ---');
  console.log(JSON.stringify(results, null, 2));
});
