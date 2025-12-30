import React from 'react';
import { motion } from 'framer-motion';
import type { TarotSpread } from '../../data/tarotSpreads';
import { Sparkles } from 'lucide-react';

interface SpreadSelectorProps {
  spreads: TarotSpread[];
  selectedSpreadId: string;
  onSelect: (spreadId: string) => void;
}

export const SpreadSelector: React.FC<SpreadSelectorProps> = ({ spreads, selectedSpreadId, onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles size={20} className="text-purple-400" />
          Choose Your Spread
        </h3>
        <p className="text-sm text-slate-400">Select a reading method that resonates with your question</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {spreads.map((spread) => (
          <motion.button
            key={spread.id}
            onClick={() => onSelect(spread.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${selectedSpreadId === spread.id
                ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className={`font-bold text-sm ${selectedSpreadId === spread.id ? 'text-purple-300' : 'text-slate-200'
                }`}>
                {spread.name}
              </h4>
              <span className={`text-xs px-2 py-1 rounded-full ${selectedSpreadId === spread.id
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'bg-slate-700 text-slate-400'
                }`}>
                {spread.cardCount} {spread.cardCount === 1 ? 'card' : 'cards'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {spread.description}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
