export interface Category {
  slug: string;
  label: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'slots', label: 'Slots', description: 'Classic reels, megaways and jackpots.' },
  { slug: 'live', label: 'Live Casino', description: 'Real dealers, streamed live.' },
  { slug: 'crash', label: 'Crash', description: 'Cash out before it crashes.' },
];
