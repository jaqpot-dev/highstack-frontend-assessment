import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { loadRouteData, matchRoute, type PageData } from './routes';

export interface RenderResult {
  status: number;
  head: string;
  html: string;
  dataScript: string;
}

/** Makes JSON safe to embed inside a <script> tag. */
function serialize(data: PageData): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function render(url: string): Promise<RenderResult> {
  const { pathname } = new URL(url, 'http://localhost');
  const route = matchRoute(pathname);
  const data = await loadRouteData(route);

  const html = renderToString(
    <StrictMode>
      <App data={data} />
    </StrictMode>,
  );

  return {
    status: route.name === 'not-found' ? 404 : 200,
    head: `<title>${escapeHtml(data.title)}</title>`,
    html,
    dataScript: `<script>window.__DATA__=${serialize(data)}</script>`,
  };
}
