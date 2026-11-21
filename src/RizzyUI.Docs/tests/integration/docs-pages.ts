import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Every page of the docs site, read from the @page directives of its Razor components, so a new page
// is scanned without anyone adding it to a list. Test harness pages (/_tests), the htmx demo
// fragments (/demo/...) and scratch pages are left out: they are not documentation.

// Playwright compiles the specs to CommonJS in this project, so __dirname, not import.meta.
const componentsRoot = resolve(__dirname, '../../Components');
const excluded = [/^\/_tests\//, /^\/demo\//, /^\/test$/, /\{/];

function razorFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return razorFiles(path);
    return name.endsWith('.razor') ? [path] : [];
  });
}

export const docsPages: string[] = [...new Set(
  razorFiles(componentsRoot).flatMap(file =>
    [...readFileSync(file, 'utf8').matchAll(/^\s*@page\s+"([^"]+)"/gm)].map(match => match[1])),
)]
  .filter(route => !excluded.some(pattern => pattern.test(route)))
  .sort();
