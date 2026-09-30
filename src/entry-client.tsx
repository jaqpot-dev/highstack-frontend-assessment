import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './App';
import type { PageData } from './routes';

declare global {
  interface Window {
    __DATA__: PageData;
  }
}

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

hydrateRoot(
  container,
  <StrictMode>
    <App data={window.__DATA__} />
  </StrictMode>,
);
