export type TarotDeckId = 'riderWaite' | 'hero' | 'lotus' | 'mythic';

export interface TarotDeck {
  id: TarotDeckId;
  name: string;
  description: string;
  cardBackUrl: string; // Will generate these
}

export const TAROT_DECKS: TarotDeck[] = [
  {
    id: 'riderWaite',
    name: 'Rider-Waite',
    description: 'The foundation of modern Tarot, rich in traditional symbolism.',
    cardBackUrl: '/aphorism/assets/card-backs/rider-waite-back.png',
  },
  {
    id: 'hero',
    name: 'Everyday Hero',
    description: 'Modern archetypes reimagined through everyday life and professions.',
    cardBackUrl: '/aphorism/assets/card-backs/hero-back.png',
  },
  {
    id: 'lotus',
    name: 'Esoteric Lotus',
    description: 'A spiritual path focused on inner space, balance, and higher consciousness.',
    cardBackUrl: '/aphorism/assets/card-backs/lotus-back.png',
  },
  {
    id: 'mythic',
    name: 'Greek Mythic',
    description: 'The journey of the soul through the lens of timeless Greek mythology.',
    cardBackUrl: '/aphorism/assets/card-backs/mythic-back.png',
  },
];
