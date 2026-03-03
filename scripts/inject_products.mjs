import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const astroPath = path.join(__dirname, '..', 'src', 'pages', '[categoria].astro');
const jsonPath = path.join(__dirname, 'formatted_products.json');

const newProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let astroContent = fs.readFileSync(astroPath, 'utf8');

for (const catName of Object.keys(newProducts)) {
    // Find the marker where the products array starts for each category
    const catMarker = `${catName}: {\n    title:`;
    const prodMarker = `products: [\n`;

    // We'll use a regex to find the specific category's "products: [" opening.
    const regex = new RegExp(`(${catName}:\\s*\\{[\\s\\S]*?products:\\s*\\[)`);
    const match = astroContent.match(regex);

    if (match) {
        // Stringify the new products for this category and append a comma
        let insertString = '';
        for (const prod of newProducts[catName]) {
            // we remove the quotes around keys for styling conformity but JSON stringify does that
            // Let's use JSON.stringify but indent it nicely
            let prodStr = JSON.stringify(prod, null, 2);
            // indent the block with 6 or 8 spaces
            prodStr = prodStr.split('\n').map(line => '      ' + line).join('\n');
            insertString += `\n${prodStr},`;
        }

        astroContent = astroContent.replace(regex, `$1${insertString}`);
        console.log(`Injected ${newProducts[catName].length} products into ${catName} category.`);
    } else {
        console.warn(`Could not find products array for category: ${catName}`);
    }
}

fs.writeFileSync(astroPath, astroContent);
console.log('Successfully updated [categoria].astro');
