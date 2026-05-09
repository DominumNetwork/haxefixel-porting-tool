import { readFileSync } from 'fs';
import { globSync } from 'glob';

const files = globSync('app/**/*.{ts,tsx}');
const bad = [];
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  if (src.includes("@/lib/")) bad.push(file);
}

if (bad.length) {
  console.error('Build blocked: found legacy @/lib imports that break TypeScript on Vercel in this repo setup.');
  for (const file of bad) console.error(` - ${file}`);
  console.error('Use relative imports like ../../../lib/jobStore instead.');
  process.exit(1);
}

console.log('Import verification passed.');
