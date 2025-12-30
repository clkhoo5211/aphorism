import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotDeckSelector } from './TarotDeckSelector';
import { SpreadSelector } from './SpreadSelector';
import { InteractiveDeck } from './InteractiveDeck';
import { SpreadLayout } from './SpreadLayout';
import { TarotCard } from './TarotCard';
import type { TarotDeckId } from '../../data/tarotDecks';
import { TAROT_DECKS } from '../../data/tarotDecks';
import { TAROT_SPREADS } from '../../data/tarotSpreads';
import type { TarotCard as TarotCardType } from '../../data/tarotCards';
import { RefreshCcw } from 'lucide-react';

interface DrawnCard {
  card: TarotCardType;
  isReversed: boolean;
  positionId: string;
  isRevealed: boolean;
}

export const TarotSection: React.FC = () => {
  const [selectedDeckId, setSelectedDeckId] = useState<TarotDeckId>('riderWaite');
  const [selectedSpreadId, setSelectedSpreadId] = useState('past-present-future');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const selectedSpread = TAROT_SPREADS.find(s => s.id === selectedSpreadId)!;
  const isReadingComplete = drawnCards.length === selectedSpread.cardCount;

  const handleCardSelect = (card: TarotCardType, isReversed: boolean) => {
    if (drawnCards.length >= selectedSpread.cardCount) return;

    const positionId = selectedSpread.positions[drawnCards.length].id;
    const newCardIndex = drawnCards.length; // Capture the index before state update
    const newCard: DrawnCard = {
      card,
      isReversed,
      positionId,
      isRevealed: false
    };

    setDrawnCards(prev => [...prev, newCard]);

    // Auto-reveal after a delay - use the captured index
    setTimeout(() => {
      setDrawnCards(prev =>
        prev.map((c, i) =>
          i === newCardIndex ? { ...c, isRevealed: true } : c
        )
      );
    }, 500);
  };

  const handleCardClick = (index: number) => {
    // Set as active card
    setActiveCardIndex(index);
    
    // Reveal card if not already revealed
    setDrawnCards(prev =>
      prev.map((c, i) =>
        i === index ? { ...c, isRevealed: !c.isRevealed } : c
      )
    );
  };

  const handleReset = () => {
    setDrawnCards([]);
    setIsDrawing(false);
    setActiveCardIndex(null);
  };

  const handleStartReading = () => {
    setIsDrawing(true);
    setDrawnCards([]);
  };

  return (
    <section className="py-6 sm:py-12 px-3 sm:px-4 relative overflow-hidden bg-slate-950 min-h-screen">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Deck Selector */}
        <TarotDeckSelector
          decks={TAROT_DECKS}
          selectedDeckId={selectedDeckId}
          onSelect={setSelectedDeckId}
        />

        <AnimatePresence mode="wait">
          {!isDrawing && drawnCards.length === 0 ? (
            /* Spread Selection */
            <motion.div
              key="spread-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12"
            >
              <SpreadSelector
                spreads={TAROT_SPREADS}
                selectedSpreadId={selectedSpreadId}
                onSelect={setSelectedSpreadId}
              />

              <div className="text-center mt-8">
                <button
                  onClick={handleStartReading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all"
                >
                  Begin Reading
                </button>
              </div>
            </motion.div>
          ) : isDrawing && !isReadingComplete ? (
            /* Card Selection */
            <motion.div
              key="card-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedSpread.name}
                </h2>
                <p className="text-slate-400">
                  Select {selectedSpread.cardCount - drawnCards.length} more{' '}
                  {selectedSpread.cardCount - drawnCards.length === 1 ? 'card' : 'cards'}
                </p>
              </div>

              {/* Show selected cards preview */}
              {drawnCards.length > 0 && (
                <div className="mb-6 sm:mb-8">
                  <div className="text-center mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-2 sm:mb-3">
                      Selected Cards ({drawnCards.length}/{selectedSpread.cardCount})
                    </h3>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
                    {drawnCards.map((drawnCard, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                      >
                        <TarotCard
                          card={drawnCard.card}
                          isReversed={drawnCard.isReversed}
                          isFlipped={drawnCard.isRevealed}
                          deckId={selectedDeckId}
                          onFlip={() => handleCardClick(index)}
                        />
                        {/* Position label */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/30">
                            {selectedSpread.positions[index]?.name || `Card ${index + 1}`}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <InteractiveDeck
                onCardSelect={handleCardSelect}
                cardsNeeded={selectedSpread.cardCount}
                selectedCount={drawnCards.length}
              />
            </motion.div>
          ) : (
            /* Spread Display */
            <motion.div
              key="spread-display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <SpreadLayout
                spread={selectedSpread}
                drawnCards={drawnCards}
                selectedDeckId={selectedDeckId}
                onCardClick={handleCardClick}
                activeCardIndex={activeCardIndex}
              />

              <div className="text-center mt-12">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
                >
                  <RefreshCcw size={18} />
                  New Reading
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
