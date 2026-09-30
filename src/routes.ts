import { CATEGORIES, type Category } from './lib/categories';

export type Route = { name: 'home' } | { name: 'not-found' };

export type PageData =
  | { route: 'home'; title: string; categories: Category[] }
  | { route: 'not-found'; title: string };

export function matchRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return { name: 'home' };
  return { name: 'not-found' };
}

/** Runs on the server before render. The result is sent to the client in window.__DATA__. */
export async function loadRouteData(route: Route): Promise<PageData> {
  switch (route.name) {
    case 'home':
      return { route: 'home', title: 'HighStack Casino', categories: CATEGORIES };
    case 'not-found':
      return { route: 'not-found', title: 'Page not found' };
  }
}
