import React from 'react';
import type { TarotDeck, TarotDeckId } from '../../data/tarotDecks';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TarotDeckSelectorProps {
  decks: TarotDeck[];
  selectedDeckId: TarotDeckId;
  onSelect: (deckId: TarotDeckId) => void;
}

export const TarotDeckSelector: React.FC<TarotDeckSelectorProps> = ({
  decks,
  selectedDeckId,
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {decks.map((deck) => (
        <button
          key={deck.id}
          onClick={() => onSelect(deck.id)}
          className={cn(
            "group relative px-4 py-2 rounded-lg border transition-all duration-300 flex flex-col items-center text-center max-w-[120px]",
            selectedDeckId === deck.id
              ? "bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              : "bg-slate-900 border-slate-700 hover:border-slate-500"
          )}
        >
          <div className="w-12 h-16 mb-2 rounded overflow-hidden border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
            <img src={deck.cardBackUrl} alt={deck.name} className="w-full h-full object-cover" />
          </div>
          <span className={cn(
            "text-xs font-bold tracking-wider uppercase transition-colors",
            selectedDeckId === deck.id ? "text-cyan-400" : "text-slate-400"
          )}>
            {deck.name}
          </span>
          <div className={cn(
            "absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyan-400 transition-all duration-300",
            selectedDeckId === deck.id && "w-3/4"
          )} />
        </button>
      ))}
    </div>
  );
};
