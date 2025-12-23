import React from 'react';
import { motion } from 'framer-motion';
import type { TarotCard as TarotCardType } from '../../data/tarotCards';
import type { TarotDeckId } from '../../data/tarotDecks';
import { getCardDisplayInfo } from '../../utils/tarotLogic';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TarotCardProps {
  card: TarotCardType;
  deckId: TarotDeckId;
  isReversed: boolean;
  isFlipped: boolean;
  onFlip: () => void;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  card,
  deckId,
  isReversed,
  isFlipped,
  onFlip,
}) => {
  const info = getCardDisplayInfo(card, deckId);

  return (
    <div className="perspective-1000 w-40 h-60 sm:w-56 sm:h-84 md:w-64 md:h-96 cursor-pointer group" onClick={onFlip}>
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Back of Card */}
        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border-4 border-purple-500/50 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.4),transparent_50%)]" />
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-purple-400/20"
                style={{ top: `${(i + 1) * 12.5}%` }}
              />
            ))}
          </div>

          {/* Center symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl text-purple-300/60">✦</div>
          </div>
        </div>

        {/* Front of Card */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden rounded-xl overflow-hidden border-2 border-cyan-400 bg-slate-950 flex flex-col items-center justify-between shadow-[0_0_20px_rgba(34,211,238,0.4)]",
            "rotate-y-180"
          )}
        >
          {/* Card Header */}
          <div className="w-full text-center pt-3 pb-1 bg-slate-900 border-b border-cyan-500/20">
            <h3 className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest">
              {card.id} • {card.name}
            </h3>
          </div>

          {/* Card Image Content */}
          <div className={cn(
            "flex-grow relative w-full overflow-hidden flex items-center justify-center bg-black",
            isReversed && "rotate-180"
          )}>
            <img
              src={info.imageUrl}
              alt={card.name}
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                console.error('Failed to load card image:', info.imageUrl);
                // Fallback to a placeholder or original URL
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('data:image')) {
                  target.src = card.imageUrl; // Fallback to original URL
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />

            <div className="absolute bottom-4 left-0 right-0 text-center px-4">
              <h2 className="text-xl font-black text-white mb-0.5 tracking-tighter italic uppercase drop-shadow-md">
                {info.displayName}
              </h2>
              <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase opacity-90 drop-shadow-md">
                {info.theme}
              </p>
            </div>
          </div>

          {/* Card Footer / Description */}
          <div className="w-full bg-slate-900 p-3 border-t border-cyan-500/20">
            <p className="text-[10px] text-slate-300 leading-tight line-clamp-3 text-center italic">
              "{info.description}"
            </p>
          </div>

          {isReversed && (
            <div className="absolute top-12 right-2 bg-red-500/20 border border-red-500/40 text-[10px] text-red-400 px-2 py-0.5 rounded-full font-mono uppercase transform rotate-180">
              Reversed
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
