import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.astro')) results.push(file);
        }
    });
    return results;
}

const files = walk('C:\\Users\\Ryzen 5\\opencode\\src');

let count = 0;
files.forEach(file => {
  if (file.includes('Header.astro') || file.includes('BaseHead.astro')) return;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/background:\s*#fff(?:fff)?;/ig, 'background: var(--vastto-surface);');
  content = content.replace(/background-color:\s*#fff(?:fff)?;/ig, 'background-color: var(--vastto-surface);');
  content = content.replace(/color:\s*#1[aA]1[aA]1[aA];/ig, 'color: var(--text-main);');
  content = content.replace(/color:\s*#4[aA]4[aA]4[aA];/ig, 'color: var(--text-body);');
  content = content.replace(/color:\s*#666(?:666)?;/ig, 'color: var(--text-muted);');
  content = content.replace(/color:\s*#888(?:888)?;/ig, 'color: var(--text-light);');
  
  content = content.replace(/background:\s*#f8f9fa;/ig, 'background: var(--vastto-bg-alt);');
  content = content.replace(/background:\s*#fdfdfd;/ig, 'background: var(--vastto-surface-alt);');
  
  content = content.replace(/border(-[a-z]+)?:\s*1px solid #f0f0f0;/ig, 'border$1: 1px solid var(--vastto-border);');
  content = content.replace(/border(-[a-z]+)?:\s*1px solid #eee(?:eee)?;/ig, 'border$1: 1px solid var(--vastto-border);');
  content = content.replace(/border(-[a-z]+)?:\s*1px solid rgba\(0,\s*0,\s*0,\s*0\.0[45]\);/ig, 'border$1: 1px solid var(--vastto-border);');
  
  content = content.replace(/box-shadow:\s*0 4px 15px rgba\(0,\s*0,\s*0,\s*0\.0[23]\);/ig, 'box-shadow: 0 4px 15px var(--vastto-shadow);');
  content = content.replace(/box-shadow:\s*0 12px 30px rgba\(71,\s*84,\s*103,\s*0\.1\);/ig, 'box-shadow: 0 12px 30px var(--vastto-shadow);');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
    count++;
  }
});

console.log(`Total files updated: ${count}`);
