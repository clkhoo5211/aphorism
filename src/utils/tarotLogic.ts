import { MAJOR_ARCANA, COMPLETE_TAROT_DECK } from '../data/tarotCards';
import type { TarotCard } from '../data/tarotCards';
import type { TarotDeckId } from '../data/tarotDecks';

/**
 * Fisher-Yates shuffle algorithm for proper deck shuffling
 * Ensures truly random distribution of cards
 */
export const shuffleDeck = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Creates a shuffled deck with reversal states
 */
export const createShuffledDeck = (): Array<{ card: TarotCard; isReversed: boolean }> => {
  const shuffledCards = shuffleDeck(COMPLETE_TAROT_DECK);
  return shuffledCards.map(card => ({
    card,
    isReversed: Math.random() > 0.5, // 50% chance of reversal
  }));
};

/**
 * Deterministically draws a card for the current day.
 * Uses the date as a seed for consistent results across refreshes.
 */
export const drawDailyCard = (date: Date): { card: TarotCard; isReversed: boolean } => {
  const seedString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const seed = Array.from(seedString).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const cardIndex = seed % MAJOR_ARCANA.length;
  // Use parity of the seed to determine if reversed
  const isReversed = seed % 2 === 0;

  return {
    card: MAJOR_ARCANA[cardIndex],
    isReversed,
  };
};

/**
 * Draws a card from a shuffled deck (ensures no duplicates until deck is exhausted)
 * Returns a new shuffled deck if the current one is empty
 */
export const drawFromShuffledDeck = (
  deck: Array<{ card: TarotCard; isReversed: boolean }>
): { card: TarotCard; isReversed: boolean; remainingDeck: Array<{ card: TarotCard; isReversed: boolean }> } => {
  if (deck.length === 0) {
    // Create a new shuffled deck if empty
    const newDeck = createShuffledDeck();
    const drawn = newDeck[0];
    return {
      card: drawn.card,
      isReversed: drawn.isReversed,
      remainingDeck: newDeck.slice(1),
    };
  }

  const drawn = deck[0];
  return {
    card: drawn.card,
    isReversed: drawn.isReversed,
    remainingDeck: deck.slice(1),
  };
};

/**
 * Draws a truly random card from the deck (legacy function for backward compatibility).
 * For new code, use drawFromShuffledDeck for proper shuffling.
 */
export const drawRandomCard = (): { card: TarotCard; isReversed: boolean } => {
  const shuffled = shuffleDeck(COMPLETE_TAROT_DECK);
  const card = shuffled[0];
  const isReversed = Math.random() > 0.5;

  return {
    card,
    isReversed,
  };
};

/**
 * Gets the local image path for a card based on deck
 */
export const getCardImageUrl = (card: TarotCard, deckId: TarotDeckId): string => {
  // Extract filename from original URL
  const originalUrl = card.imageUrl;
  const filename = originalUrl.split('/').pop() || '';
  
  // Map deck IDs to directory names
  const deckMap: Record<TarotDeckId, string> = {
    riderWaite: 'rider-waite',
    hero: 'hero',
    lotus: 'lotus',
    mythic: 'mythic',
  };
  
  const deckDir = deckMap[deckId] || 'rider-waite';
  
  // All cards (Major and Minor Arcana) are now available locally
  // Format: ar00.jpg (Major), w01.jpg, c01.jpg, s01.jpg, p01.jpg (Minor)
  if (filename.endsWith('.jpg')) {
    return `/aphorism/assets/tarot-cards/${deckDir}/${filename}`;
  }
  
  // Fallback to original URL if filename extraction fails
  return card.imageUrl;
};

/**
 * Gets deck-specific info for a card.
 */
export const getCardDisplayInfo = (card: TarotCard, deckId: TarotDeckId) => {
  const mapping = card.mappings[deckId];
  
  // Fallback to riderWaite mapping or card defaults if mapping doesn't exist
  const fallbackMapping = card.mappings.riderWaite || {
    name: card.name,
    theme: 'Traditional',
    description: `Traditional interpretation of ${card.name}.`,
  };
  
  const activeMapping = mapping || fallbackMapping;
  
  return {
    displayName: activeMapping.name,
    theme: activeMapping.theme,
    description: activeMapping.description,
    meaningUpright: card.meaningUpright,
    meaningReversed: card.meaningReversed,
    imageUrl: getCardImageUrl(card, deckId),
  };
};
