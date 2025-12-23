import React from 'react';
import { motion } from 'framer-motion';
import { TarotCard } from './TarotCard';
import { getCardDisplayInfo } from '../../utils/tarotLogic';
import type { TarotSpread } from '../../data/tarotSpreads';
import type { TarotCard as TarotCardType } from '../../data/tarotCards';
import type { TarotDeckId } from '../../data/tarotDecks';

interface DrawnCard {
  card: TarotCardType;
  isReversed: boolean;
  positionId: string;
  isRevealed: boolean;
}

interface SpreadLayoutProps {
  spread: TarotSpread;
  drawnCards: DrawnCard[];
  selectedDeckId: TarotDeckId;
  onCardClick: (index: number) => void;
  activeCardIndex: number | null;
}

export const SpreadLayout: React.FC<SpreadLayoutProps> = ({
  spread,
  drawnCards,
  selectedDeckId,
  onCardClick,
  activeCardIndex
}) => {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Spread Title */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{spread.name}</h3>
        <p className="text-sm text-slate-400">{spread.description}</p>
      </div>

      {/* Card Layout */}
      <div className="relative w-full min-h-[400px] py-8">
        <div className={`flex ${
          spread.cardCount <= 3 ? 'justify-center' : 'justify-center flex-wrap'
        } items-start gap-4 md:gap-6 lg:gap-8`}>
          {spread.positions.map((position, index) => {
            const drawnCard = drawnCards.find(dc => dc.positionId === position.id);

            return (
              <motion.div
                key={position.id}
                className="relative flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Position Label */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p className="text-xs font-mono text-purple-300 uppercase tracking-wider">
                    {position.name}
                  </p>
                </div>

                {/* Card or Placeholder */}
                {drawnCard ? (
                  <motion.div
                    onClick={() => onCardClick(index)}
                    className={`cursor-pointer relative group ${
                      activeCardIndex === index ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-950 rounded-xl' : ''
                    }`}
                    style={{
                      transform: position.rotation ? `rotate(${position.rotation}deg)` : undefined
                    }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      scale: activeCardIndex === index ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <TarotCard
                      card={drawnCard.card}
                      isReversed={drawnCard.isReversed}
                      isFlipped={drawnCard.isRevealed}
                      deckId={selectedDeckId}
                      onFlip={() => onCardClick(index)}
                    />
                    {/* Active/Selected indicator */}
                    {activeCardIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-3 -right-3 w-6 h-6 bg-cyan-400 rounded-full border-2 border-slate-950 shadow-lg flex items-center justify-center"
                      >
                        <span className="text-slate-950 text-xs font-bold">✓</span>
                      </motion.div>
                    )}
                    {/* Revealed indicator */}
                    {drawnCard.isRevealed && activeCardIndex !== index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950 shadow-lg"
                      />
                    )}
                  </motion.div>
                ) : (
                  <div className="w-[140px] h-[210px] border-2 border-dashed border-purple-500/30 rounded-lg flex items-center justify-center bg-slate-900/30">
                    <span className="text-purple-500/50 text-4xl">?</span>
                  </div>
                )}

                {/* Position Description */}
                {drawnCard && drawnCard.isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-56 text-center"
                  >
                    <p className="text-xs text-slate-400 leading-tight px-2">
                      {position.description}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detailed Interpretation Panel */}
      {activeCardIndex !== null && drawnCards[activeCardIndex] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="bg-slate-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">
                  {spread.positions[activeCardIndex]?.name}
                </h4>
                <p className="text-sm text-slate-400">
                  {spread.positions[activeCardIndex]?.description}
                </p>
              </div>
              {drawnCards[activeCardIndex].isReversed && (
                <span className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded-full text-xs font-mono uppercase">
                  Reversed
                </span>
              )}
            </div>

            <div className="border-t border-slate-700 pt-4 mt-4">
              <h5 className="text-base font-semibold text-cyan-400 mb-2">
                {drawnCards[activeCardIndex].card.name}
              </h5>
              <p className="text-sm text-slate-300 leading-relaxed">
                {drawnCards[activeCardIndex].isReversed
                  ? drawnCards[activeCardIndex].card.meaningReversed
                  : drawnCards[activeCardIndex].card.meaningUpright}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 italic">
                {getCardDisplayInfo(drawnCards[activeCardIndex].card, selectedDeckId).description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
