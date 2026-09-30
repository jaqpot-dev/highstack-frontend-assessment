import { gamesById } from './data';

const PALETTE = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#ec4899'];

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function svg(width: number, height: number, label: string, seed: number): string {
  const color = PALETTE[seed % PALETTE.length];
  const fontSize = Math.round(Math.min(width, height) / 10);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#18181b"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="${fontSize}" font-weight="700" text-anchor="middle" dominant-baseline="middle">${escapeXml(label)}</text>
</svg>`;
}

export function getImage(name: string): string | null {
  const hero = /^hero-([a-z]+)$/.exec(name);
  if (hero?.[1]) {
    return svg(1200, 400, hero[1].toUpperCase(), hero[1].length);
  }
  const game = gamesById.get(name);
  if (!game) return null;
  return svg(game.width, game.height, game.name, Number(game.id.slice(2)));
}
