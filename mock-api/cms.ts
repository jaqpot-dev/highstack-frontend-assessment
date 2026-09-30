import { CATEGORY_SLUGS, PUBLIC_URL, type CategorySlug } from './data';

const startedAt = Date.now();
const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

const COPY: Record<CategorySlug, { title: string; subtitle: string; text: string; banner: string; tone: string }> = {
  slots: {
    title: 'Spin the best slots',
    subtitle: 'Over 25 hand-picked slots from top studios.',
    text: 'Slots are the heart of HighStack.\n\nEvery game shows its **RTP** and **volatility**, so you know what to expect before you spin.',
    banner: 'New: weekly free spins for all verified players.',
    tone: 'info',
  },
  live: {
    title: 'Live tables, real dealers',
    subtitle: 'Roulette, blackjack and game shows, 24/7.',
    text: 'Live games are streamed in HD from our partner studios.\n\nTable limits change per table. Check the limits before you join.',
    banner: 'Some tables are in maintenance tonight between 02:00 and 03:00 UTC.',
    tone: 'warning',
  },
  crash: {
    title: 'Crash games',
    subtitle: 'Fast rounds. Cash out in time.',
    text: 'Crash games are **provably fair**.\n\nYou can check the result of every round in the game history.',
    banner: 'Tournament winners have been paid.',
    tone: 'success',
  },
};

export function getPage(slug: string) {
  if (!(CATEGORY_SLUGS as string[]).includes(slug)) return null;
  const copy = COPY[slug as CategorySlug];

  return {
    slug,
    blocks: [
      {
        _uid: `${slug}-hero`,
        component: 'hero',
        title: copy.title,
        subtitle: copy.subtitle,
        image: { url: `${PUBLIC_URL}/img/hero-${slug}.svg`, alt: copy.title, width: 1200, height: 400 },
        ctaLabel: 'Browse games',
        ctaHref: '#games',
      },
      {
        _uid: `${slug}-promo`,
        component: 'countdown',
        title: 'Weekend race ends in',
        endsAt: new Date(startedAt + TWO_DAYS).toISOString(),
      },
      {
        _uid: `${slug}-banner`,
        component: 'banner',
        message: copy.banner,
        tone: copy.tone,
      },
      {
        _uid: `${slug}-text`,
        component: 'text',
        body: copy.text,
      },
    ],
  };
}
