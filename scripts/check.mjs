import { exec } from 'child_process';
exec('npx astro check', (err, stdout, stderr) => {
  const lines = stdout.split('\n');
  const errors = lines.filter((_, i) => lines[i].includes('error '));
  const fullErrors = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('error ')) {
        fullErrors.push(lines.slice(Math.max(0, i-2), i+4).join('\n'));
    }
  }
  console.log(fullErrors.join('\n\n'));
});
