// Downloads the third-party widget libraries listed in vendor.json into wwwroot/lib.
// The files are committed; run this only when RizzyUI pins new versions (npm run vendor).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(resolve(projectRoot, 'vendor.json'), 'utf8'));

for (const asset of [...manifest.assets, { key: 'htmx', ...manifest.htmx }]) {
  const response = await fetch(asset.url);
  if (!response.ok) {
    throw new Error(`${asset.url}: HTTP ${response.status}`);
  }
  const destination = resolve(projectRoot, 'wwwroot', asset.path);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  console.log(`${asset.key} -> wwwroot/${asset.path}`);
}
