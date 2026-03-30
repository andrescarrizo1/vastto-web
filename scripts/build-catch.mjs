import { execSync } from 'child_process';
import fs from 'fs';
try {
  execSync('npx astro build', { encoding: 'utf-8' });
} catch (e) {
  fs.writeFileSync('error.txt', e.stderr || e.stdout);
}
