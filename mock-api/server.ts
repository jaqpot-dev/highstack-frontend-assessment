import http from 'node:http';
import { getPage } from './cms';
import { executeGraphQL, type GraphQLRequestBody } from './graphql';
import { getImage } from './images';

const port = Number(process.env.MOCK_PORT ?? 4000);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const networkDelay = () => sleep(200 + Math.floor(Math.random() * 1300));

function sendJson(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readBody(req: http.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf-8');
}

async function handle(req: http.IncomingMessage, res: http.ServerResponse) {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (url.pathname === '/graphql' && req.method === 'POST') {
    let body: GraphQLRequestBody;
    try {
      body = JSON.parse(await readBody(req)) as GraphQLRequestBody;
    } catch {
      sendJson(res, 400, { errors: [{ message: 'Invalid JSON body' }] });
      return;
    }
    await networkDelay();
    const result = await executeGraphQL(body);
    sendJson(res, 200, result);
    return;
  }

  const cmsMatch = /^\/cms\/pages\/([a-z0-9-]+)$/.exec(url.pathname);
  if (cmsMatch?.[1] && req.method === 'GET') {
    await networkDelay();
    const page = getPage(cmsMatch[1]);
    if (!page) {
      sendJson(res, 404, { error: 'Page not found' });
      return;
    }
    sendJson(res, 200, page);
    return;
  }

  const imgMatch = /^\/img\/([a-z0-9_-]+)\.svg$/.exec(url.pathname);
  if (imgMatch?.[1] && req.method === 'GET') {
    const image = getImage(imgMatch[1]);
    if (!image) {
      res.writeHead(404, CORS_HEADERS);
      res.end();
      return;
    }
    res.writeHead(200, {
      ...CORS_HEADERS,
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(image);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

http
  .createServer((req, res) => {
    handle(req, res).catch((error: unknown) => {
      console.error(error);
      if (!res.headersSent) sendJson(res, 500, { error: 'Internal error' });
    });
  })
  .listen(port, () => {
    console.log(`Mock API running at http://localhost:${port}`);
    console.log(`  GraphQL: POST http://localhost:${port}/graphql`);
    console.log(`  CMS:     GET  http://localhost:${port}/cms/pages/:slug`);
  });
