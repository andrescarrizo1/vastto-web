import { execSync } from 'child_process';
try {
  const out = execSync('npx astro check', { encoding: 'utf-8' });
  console.log("SUCCESS:");
  console.log(out);
} catch (e) {
  console.log("FAIL:");
  console.log(e.stdout);
}
