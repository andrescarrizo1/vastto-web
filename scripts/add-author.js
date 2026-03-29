import fs from 'fs';
import path from 'path';

const SRC_DIRS = [
  './src/pages/celulares',
  './src/pages/auriculares',
  './src/pages/smartwatch'
];

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.astro') && !fullPath.endsWith('index.astro')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = SRC_DIRS.flatMap(dir => getFiles(path.join(process.cwd(), dir).replace(/\\/g, '/')));
console.log('Found files:', allFiles);

let updated = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if already has AuthorBio
  if (content.includes('AuthorBio')) continue;
  
  // Skip if it doesn't have an <article> tag
  if (!content.includes('</article>')) continue;

  // Add import
  content = content.replace(
    /---[\r\n]+([\s\S]+?)---/,
    (match, p1) => `---\nimport AuthorBio from '../../components/AuthorBio.astro';\n${p1}---`
  );

  // Add before </article>
  content = content.replace(/(<\s*\/\s*article\s*>)/i, '  <div class="container-narrow"><AuthorBio /></div>\n  $1');

  fs.writeFileSync(file, content, 'utf8');
  updated++;
  console.log('Updated:', file);
}

console.log('Total files updated:', updated);
