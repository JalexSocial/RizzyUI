import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] || './wwwroot');
const port = Number(process.env.PORT || 5150);
const host = process.env.HOST || '127.0.0.1';
let lastRequestAt = 0;
let requestCount = 0;

const contentTypes = new Map([
  ['.css', 'text/css'],
  ['.html', 'text/html'],
  ['.js', 'text/javascript'],
  ['.json', 'application/json'],
  ['.map', 'application/json'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2']
]);

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const candidate = normalize(join(root, pathname === '/' ? 'index.html' : pathname));
  return candidate.startsWith(root + sep) || candidate === root ? candidate : null;
}

const server = createServer((request, response) => {
  requestCount += 1;
  lastRequestAt = Date.now();

  const filePath = resolveRequestPath(request.url || '/');
  if (new URL(request.url || '/', `http://${host}:${port}`).pathname === '/' && !existsSync(join(root, 'index.html'))) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('OK');
    return;
  }

  const resolvedPath = filePath && existsSync(filePath) && statSync(filePath).isFile()
    ? filePath
    : join(root, 'index.html');

  if (!existsSync(resolvedPath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': contentTypes.get(extname(resolvedPath)) || 'application/octet-stream'
  });
  createReadStream(resolvedPath).pipe(response);
});

server.listen(port, host);

setInterval(() => {
  if (requestCount > 0 && Date.now() - lastRequestAt > 30000) {
    shutdown();
  }
}, 5000);

function shutdown() {
  server.close();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
