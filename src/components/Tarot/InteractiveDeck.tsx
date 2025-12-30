import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TarotCard as TarotCardType } from '../../data/tarotCards';

interface InteractiveDeckProps {
  onCardSelect: (card: TarotCardType, isReversed: boolean) => void;
  cardsNeeded: number;
  selectedCount: number;
}

export const InteractiveDeck: React.FC<InteractiveDeckProps> = ({
  onCardSelect,
  cardsNeeded,
  selectedCount
}) => {
  // Maintain a shuffled deck state to ensure proper shuffling
  const [shuffledDeck, setShuffledDeck] = useState<Array<{ card: TarotCardType; isReversed: boolean }> | null>(null);

  // Initialize shuffled deck on mount
  useEffect(() => {
    const initializeDeck = async () => {
      const { createShuffledDeck } = await import('../../utils/tarotLogic');
      setShuffledDeck(createShuffledDeck());
    };
    initializeDeck();
  }, []);

  // Reset deck when starting a new reading
  useEffect(() => {
    if (selectedCount === 0 && shuffledDeck && shuffledDeck.length < 10) {
      // Re-shuffle if deck is getting low
      const reinitializeDeck = async () => {
        const { createShuffledDeck } = await import('../../utils/tarotLogic');
        setShuffledDeck(createShuffledDeck());
      };
      reinitializeDeck();
    }
  }, [selectedCount, shuffledDeck]);

  const handleCardClick = async () => {
    if (!shuffledDeck || shuffledDeck.length === 0) {
      // Fallback to random if deck not initialized
      const { COMPLETE_TAROT_DECK } = await import('../../data/tarotCards');
      const { shuffleDeck } = await import('../../utils/tarotLogic');
      const shuffled = shuffleDeck(COMPLETE_TAROT_DECK);
      const card = shuffled[0];
      const isReversed = Math.random() > 0.5;
      onCardSelect(card, isReversed);
      return;
    }

    // Draw from shuffled deck
    const { drawFromShuffledDeck } = await import('../../utils/tarotLogic');
    const result = drawFromShuffledDeck(shuffledDeck);
    
    onCardSelect(result.card, result.isReversed);
    setShuffledDeck(result.remainingDeck);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-2">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4 perspective-1000">
        <AnimatePresence>
          {Array.from({ length: 24 }).map((_, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer group touch-manipulation"
              style={{
                width: 'clamp(60px, 15vw, 80px)',
                height: 'clamp(90px, 22.5vw, 120px)',
              }}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.1, zIndex: 10, y: -10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleCardClick()}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.9)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              {/* Card Back */}
              <div className="w-full h-full rounded-lg border-2 border-purple-500/50 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-purple-500/50 group-hover:border-purple-400">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.4),transparent_50%)]" />
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-px bg-purple-400/20"
                      style={{ top: `${(i + 1) * 16}%` }}
                    />
                  ))}
                </div>

                {/* Center symbol */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-2xl text-purple-300/60">✦</div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-purple-400/0 group-hover:bg-purple-400/20 transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center bg-slate-900/50 px-6 py-2 rounded-full border border-purple-500/30">
        <p className="text-sm text-purple-200 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Select {cardsNeeded - selectedCount} more {cardsNeeded - selectedCount === 1 ? 'card' : 'cards'} to complete the spread
        </p>
      </div>
    </div>
  );
};
