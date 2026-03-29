const fs = require('fs');
const path = require('path');

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

const files = walk(path.join('C:\\Users\\Ryzen 5\\opencode', 'src'));

files.forEach(file => {
  if (file.includes('Header.astro') || file.includes('BaseHead.astro')) return;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/background:\s*#fff(?:fff)?;/g, 'background: var(--vastto-surface);');
  content = content.replace(/background-color:\s*#fff(?:fff)?;/g, 'background-color: var(--vastto-surface);');
  content = content.replace(/color:\s*#1[aA]1[aA]1[aA];/g, 'color: var(--text-main);');
  content = content.replace(/color:\s*#4[aA]4[aA]4[aA];/g, 'color: var(--text-body);');
  content = content.replace(/color:\s*#666(?:666)?;/g, 'color: var(--text-muted);');
  content = content.replace(/color:\s*#888(?:888)?;/g, 'color: var(--text-light);');
  content = content.replace(/background:\s*#f8f9fa;/g, 'background: var(--vastto-bg-alt);');
  content = content.replace(/background:\s*#fdfdfd;/g, 'background: var(--vastto-surface-alt);');
  content = content.replace(/border(-[a-z]+)?:\s*1px solid #f0f0f0;/g, 'border$1: 1px solid var(--vastto-border);');
  content = content.replace(/border(-[a-z]+)?:\s*1px solid #eee;/g, 'border$1: 1px solid var(--vastto-border);');
  content = content.replace(/border(-[a-z]+)?:\s*1px solid rgba\(0,\s*0,\s*0,\s*0\.0[45]\);/g, 'border$1: 1px solid var(--vastto-border);');
  content = content.replace(/box-shadow:\s*0 4px 15px rgba\(0,\s*0,\s*0,\s*0\.03\);/g, 'box-shadow: 0 4px 15px var(--vastto-shadow);');
  
  // Custom tweaks for specific components
  content = content.replace(/background:\s*#1a1a1a;/g, 'background: var(--text-main);');
  content = content.replace(/color:\s*#fff(?:fff)?;/g, 'color: var(--vastto-bg);');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
