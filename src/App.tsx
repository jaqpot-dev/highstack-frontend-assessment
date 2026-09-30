import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import type { PageData } from './routes';

export function App({ data }: { data: PageData }) {
  return <Layout>{renderPage(data)}</Layout>;
}

function renderPage(data: PageData) {
  switch (data.route) {
    case 'home':
      return <HomePage categories={data.categories} />;
    case 'not-found':
      return <NotFoundPage />;
  }
}
