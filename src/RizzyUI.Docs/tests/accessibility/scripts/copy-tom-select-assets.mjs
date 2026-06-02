import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(__dirname, '../../..');
const vendorRoot = join(docsRoot, 'wwwroot/vendor/tom-select');

const assets = [
  {
    source: join(docsRoot, 'node_modules/tom-select/dist/css/tom-select.css'),
    target: join(vendorRoot, 'tom-select.css')
  },
  {
    source: join(docsRoot, 'node_modules/tom-select/dist/js/tom-select.complete.min.js'),
    target: join(vendorRoot, 'tom-select.complete.min.js')
  }
];

mkdirSync(vendorRoot, { recursive: true });

for (const asset of assets) {
  if (!existsSync(asset.source)) {
    throw new Error(`Missing Tom Select asset: ${asset.source}. Run npm install in src/RizzyUI.Docs.`);
  }

  copyFileSync(asset.source, asset.target);
}
