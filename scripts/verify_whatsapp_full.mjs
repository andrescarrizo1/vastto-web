import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const DIST_DIR = path.resolve('dist');
const SCREENSHOTS_DIR = 'C:\\Users\\Ryzen 5\\.gemini\\antigravity\\brain\\c4a31db5-4689-4440-acee-871b86a26028\\screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(DIST_DIR, reqPath);

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
const EXPECTED_PHONE = '5492406033660';
const FORBIDDEN_PHONE = '5492604000000';

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
  { path: '/ruta-inexistente-404', name: 'Ruta 404' }
];

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  
  const browser = await chromium.launch({ headless: true });
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  const auditReport = [];
  const allWhatsAppLinks = new Set();
  const consoleErrors = [];

  for (const item of routesToTest) {
    const url = `http://localhost:${PORT}${item.path}`;
    const page = await desktopContext.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push({ route: item.path, text: msg.text() });
      }
    });

    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      const status = response.status();
      const title = await page.title();

      // Collect all WhatsApp links
      const waLinks = await page.$$eval('a[href*="wa.me"]', anchors => anchors.map(a => ({
        href: a.href,
        text: a.innerText.trim(),
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel')
      })));

      let validLinks = true;
      let hasForbiddenPhone = false;

      for (const link of waLinks) {
        allWhatsAppLinks.add(link.href);
        if (!link.href.includes(`wa.me/${EXPECTED_PHONE}`)) {
          validLinks = false;
        }
        if (link.href.includes(FORBIDDEN_PHONE)) {
          hasForbiddenPhone = true;
        }
      }

      // Check page text for forbidden phone
      const content = await page.content();
      if (content.includes(FORBIDDEN_PHONE)) {
        hasForbiddenPhone = true;
      }

      // Screenshots for required pages
      if (item.path === '/demos/inmobiliaria') {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'demo_inmobiliaria_desktop.png'), fullPage: false });
        
        const mPage = await mobileContext.newPage();
        await mPage.goto(url, { waitUntil: 'domcontentloaded' });
        await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'demo_inmobiliaria_mobile.png'), fullPage: false });
        await mPage.close();
      }

      if (item.path === '/contacto') {
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'contacto_desktop.png'), fullPage: false });
        
        const mPage = await mobileContext.newPage();
        await mPage.goto(url, { waitUntil: 'domcontentloaded' });
        await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'contacto_mobile.png'), fullPage: false });
        await mPage.close();
      }

      const isOk = (item.path === '/ruta-inexistente-404' ? status === 404 : status === 200) && !hasForbiddenPhone && validLinks;

      auditReport.push({
        path: item.path,
        name: item.name,
        status,
        title,
        waButtonCount: waLinks.length,
        hasExpectedPhoneOnly: validLinks,
        hasForbiddenPhone,
        statusVerdict: isOk ? 'OK' : 'FAIL'
      });

    } catch (err) {
      auditReport.push({
        path: item.path,
        name: item.name,
        status: 'ERROR',
        title: err.message,
        waButtonCount: 0,
        hasExpectedPhoneOnly: false,
        hasForbiddenPhone: false,
        statusVerdict: 'ERROR'
      });
    } finally {
      await page.close();
    }
  }

  await desktopContext.close();
  await mobileContext.close();
  await browser.close();
  server.close();

  console.log('\n=== REPORTE AUDITORÍA DE RUTAS Y WHATSAPP ===');
  console.log(JSON.stringify(auditReport, null, 2));

  console.log('\n=== LISTA DE ENLACES WA.ME RECORRIDOS Y VERIFICADOS ===');
  console.log(Array.from(allWhatsAppLinks));

  console.log('\n=== ERRORES JS DE CONSOLA ===');
  console.log(consoleErrors.length === 0 ? 'Cero errores de consola detectados.' : consoleErrors);
});
