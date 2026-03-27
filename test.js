import fs from 'fs';
const content = fs.readFileSync('src/pages/index.astro', 'utf8');
const lines = content.split('\n');
console.log("Lines in index:", lines.length);

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('url') && lines[i].includes('mercadolibre.com.ar/')) {
    let url = '';
    if (lines[i].includes("'")) {
      url = lines[i].split("'")[1];
    } else if (lines[i].includes('"')) {
      const parts = lines[i].split('"');
      for (let p of parts) {
        if (p.includes('http')) url = p;
      }
    }
    console.log("Found line:", lines[i].trim());
    console.log("Parsed URL:", url);
    console.log("Includes http?", url.includes('http'));
  }
}
