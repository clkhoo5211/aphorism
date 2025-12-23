import { DIVINATION_LOTS } from '../data/divinationData';
import { GUANYIN_LOTS } from '../data/guanyinData';
import { DIVINATION_SYSTEMS, type DivinationSystemLot } from '../data/chineseDivinationSystems';
import type { DivinationLot } from '../data/divinationData';
import type { GuanYinLot } from '../data/guanyinData';

// Convert GuanYinLot to DivinationLot format
const convertGuanYinLot = (lot: GuanYinLot): DivinationLot => ({
  id: lot.id,
  fortune: lot.fortune,
  poem: lot.poem,
  poemAnalysis: lot.poemAnalysis,
  meanings: lot.meanings,
  advice: lot.advice
});

// Convert DivinationSystemLot to DivinationLot format
const convertSystemLot = (lot: DivinationSystemLot, systemName: string): DivinationLot => ({
  id: lot.id,
  fortune: lot.fortune,
  poem: lot.poem,
  poemAnalysis: `${systemName} • ${lot.interpretation}`,
  meanings: [],
  advice: lot.advice
});

/**
 * Get all lots from all divination systems merged into one pool
 */
const getAllLots = (): DivinationLot[] => {
  const allLots: DivinationLot[] = [];

  // Add Guan Yin lots (extended dataset)
  if (GUANYIN_LOTS.length > 0) {
    allLots.push(...GUANYIN_LOTS.map(lot => convertGuanYinLot(lot)));
  }

  // Add all other Chinese systems (exclude guanyin as it's added separately)
  Object.values(DIVINATION_SYSTEMS).forEach(system => {
    if (system.id !== 'guanyin') {
      allLots.push(...system.lots.map(lot => convertSystemLot(lot, system.name)));
    }
  });

  // Add Japanese Senso-ji lots
  allLots.push(...DIVINATION_LOTS);

  return allLots;
};

/**
 * Draws a random lot from ALL divination systems combined.
 * This creates a "Universal Oracle" experience.
 */
export const drawRandomLot = (): DivinationLot => {
  const allLots = getAllLots();
  const randomIndex = Math.floor(Math.random() * allLots.length);
  return allLots[randomIndex];
};

/**
 * Deterministically draws a lot for a specific user query from ALL systems.
 */
export const drawPersonalizedLot = (question: string): DivinationLot => {
  if (!question.trim()) return drawRandomLot();

  const allLots = getAllLots();
  const seed = Array.from(question).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const lotIndex = seed % allLots.length;
  return allLots[lotIndex];
};

/**
 * Get statistics about the combined oracle
 */
export const getOracleStats = () => {
  const allLots = getAllLots();
  return {
    totalLots: allLots.length,
    systems: {
      guanyin: GUANYIN_LOTS.length,
      chinese: Object.values(DIVINATION_SYSTEMS).reduce((sum, sys) => sum + sys.lots.length, 0),
      japanese: DIVINATION_LOTS.length
    }
  };
};
