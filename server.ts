import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ViteDevServer } from 'vite';

type EntryServer = typeof import('./src/entry-server');

const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT ?? 5173);
const root = path.dirname(fileURLToPath(import.meta.url));

let vite: ViteDevServer | undefined;
let serveStatic: ((req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void) | undefined;
let prodTemplate = '';

if (isProduction) {
  const sirv = (await import('sirv')).default;
  serveStatic = sirv(path.join(root, 'dist/client'), { extensions: [], gzip: true });
  prodTemplate = await fs.readFile(path.join(root, 'dist/client/index.html'), 'utf-8');
} else {
  const { createServer } = await import('vite');
  vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
  });
}

async function loadEntry(): Promise<EntryServer> {
  if (vite) {
    return (await vite.ssrLoadModule('/src/entry-server.tsx')) as EntryServer;
  }
  const entryPath = path.join(root, 'dist/server/entry-server.js');
  return (await import(entryPath)) as EntryServer;
}

async function getTemplate(url: string): Promise<string> {
  if (vite) {
    const raw = await fs.readFile(path.join(root, 'index.html'), 'utf-8');
    return vite.transformIndexHtml(url, raw);
  }
  return prodTemplate;
}

async function renderPage(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = req.url ?? '/';
  try {
    const [template, { render }] = await Promise.all([getTemplate(url), loadEntry()]);
    const result = await render(url);
    const html = template
      .replace('<!--app-head-->', result.head)
      .replace('<!--app-html-->', result.html)
      .replace('<!--app-data-->', result.dataScript);
    res.writeHead(result.status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (error) {
    if (error instanceof Error) vite?.ssrFixStacktrace(error);
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
}

const server = http.createServer((req, res) => {
  const next = () => void renderPage(req, res);
  const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;

  if (vite) {
    vite.middlewares(req, res, next);
  } else if (serveStatic && pathname !== '/' && pathname !== '/index.html') {
    serveStatic(req, res, next);
  } else {
    next();
  }
});

server.listen(port, () => {
  console.log(`App running at http://localhost:${port} (${isProduction ? 'production' : 'development'})`);
});
