import fs from 'fs';
const raw = fs.readFileSync('build-errors.txt', 'utf16le');
fs.writeFileSync('clean-errors.txt', raw, 'utf8');
