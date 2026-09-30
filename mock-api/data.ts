export const PUBLIC_URL = process.env.MOCK_PUBLIC_URL ?? `http://localhost:${process.env.MOCK_PORT ?? 4000}`;

export type CategorySlug = 'slots' | 'live' | 'crash';
export const CATEGORY_SLUGS: CategorySlug[] = ['slots', 'live', 'crash'];

export interface ProviderRecord {
  id: string;
  name: string;
}

export interface GameRecord {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  providerId: string;
  hasThumbnail: boolean;
  width: number;
  height: number;
  rtp: number | null;
  volatility: 'low' | 'medium' | 'high';
}

// Small deterministic PRNG so the catalog is the same on every start.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(12345);
const pick = <T>(list: readonly T[]): T => list[Math.floor(rand() * list.length)] as T;

export const providers: ProviderRecord[] = [
  { id: 'prv_1', name: 'Nebula Games' },
  { id: 'prv_2', name: 'RedFox Studio' },
  { id: 'prv_3', name: 'Kraken Play' },
  { id: 'prv_4', name: 'Lucky Anvil' },
  { id: 'prv_5', name: 'Polar Spin' },
  { id: 'prv_6', name: 'Ironclad Live' },
];

const ADJECTIVES = ['Golden', 'Mega', 'Wild', 'Lucky', 'Frozen', 'Dragon', 'Neon', 'Royal', 'Cosmic', 'Mystic', 'Turbo', 'Diamond'];
const NOUNS: Record<CategorySlug, string[]> = {
  slots: ['Reels', 'Fortune', 'Pharaoh', 'Fruits', 'Treasure', 'Jackpot', 'Gems', 'Vikings'],
  live: ['Roulette', 'Blackjack', 'Baccarat', 'Poker', 'Wheel', 'Sic Bo', 'Dream Catcher'],
  crash: ['Rocket', 'Aviator', 'Limbo', 'Plinko', 'Mines', 'Jet', 'Balloon'],
};
const SIZES: Record<CategorySlug, Array<[number, number]>> = {
  slots: [[400, 300], [400, 300], [300, 400]],
  live: [[300, 400], [400, 500]],
  crash: [[400, 400], [400, 300]],
};
const VOLATILITY = ['low', 'medium', 'high'] as const;

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function buildCatalog(): GameRecord[] {
  const counts: Record<CategorySlug, number> = { slots: 26, live: 18, crash: 16 };
  const games: GameRecord[] = [];
  const usedNames = new Set<string>();
  let n = 1;

  for (const category of CATEGORY_SLUGS) {
    for (let i = 0; i < counts[category]; i++) {
      let name = `${pick(ADJECTIVES)} ${pick(NOUNS[category])}`;
      while (usedNames.has(name)) name = `${name} ${usedNames.size % 9 + 2}`;
      usedNames.add(name);

      const [width, height] = pick(SIZES[category]);
      const id = `g_${String(n).padStart(3, '0')}`;
      const providerRoll = rand();
      games.push({
        id,
        name,
        slug: `${slugify(name)}-${n}`,
        category,
        providerId:
          providerRoll < 0.1
            ? 'prv_9'
            : pick(category === 'live' ? ['prv_2', 'prv_3', 'prv_6'] : ['prv_1', 'prv_2', 'prv_3', 'prv_4', 'prv_5']),
        hasThumbnail: rand() >= 0.15,
        width,
        height,
        rtp: category === 'live' ? null : Math.round((94 + rand() * 3.9) * 100) / 100,
        volatility: pick(VOLATILITY),
      });
      n++;
    }
  }
  return games;
}

export const games = buildCatalog();

export const gamesById = new Map(games.map((g) => [g.id, g]));
export const providersById = new Map(providers.map((p) => [p.id, p]));
