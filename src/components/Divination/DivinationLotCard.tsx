import React from 'react';
import { motion } from 'framer-motion';
import type { DivinationLot } from '../../data/divinationData';
import { Scroll, Zap, Shield, Heart } from 'lucide-react';

interface DivinationLotCardProps {
  lot: DivinationLot;
}

export const DivinationLotCard: React.FC<DivinationLotCardProps> = ({ lot }) => {
  const getFortuneColor = (fortune: string) => {
    if (fortune.includes('大吉')) return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
    if (fortune.includes('吉')) return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
    if (fortune.includes('凶')) return 'text-red-400 border-red-500/50 bg-red-500/10';
    return 'text-slate-400 border-slate-500/50 bg-slate-500/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]"
    >
      {/* Header with Lot ID and Fortune */}
      <div className="p-4 sm:p-6 border-b border-cyan-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/50">
        <div>
          <span className="text-[9px] sm:text-[10px] font-mono text-cyan-500 uppercase tracking-[0.2em]">Oracle Response Node #{lot.id < 10 ? `0${lot.id}` : lot.id}</span>
          <h2 className="text-xl sm:text-2xl font-black text-white italic tracking-tighter uppercase mt-1">
            {lot.fortune} • <span className="text-cyan-400">Divine Sequence</span>
          </h2>
        </div>
        <div className={`px-3 sm:px-4 py-1 rounded-full border ${getFortuneColor(lot.fortune)} text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap`}>
          {lot.fortune}
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        {/* Poem Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Scroll size={20} className="text-cyan-400" />
          </div>
          <div className="space-y-2">
            {lot.poem.map((line, idx) => (
              <p key={idx} className="text-lg sm:text-xl md:text-2xl font-serif text-slate-100 tracking-widest leading-relaxed px-2">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Detailed Analysis Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-[10px] uppercase tracking-widest">
              <Zap size={14} />
              <span>Pattern Analysis</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-purple-500/30 pl-4 py-1">
              {lot.poemAnalysis}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-widest">
              <Shield size={14} />
              <span>Strategic Executables</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {lot.meanings.slice(0, 4).map((m, idx) => (
                <div key={idx} className="bg-slate-950/40 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{m.label}</span>
                  <span className="text-[11px] text-cyan-300 font-medium">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {lot.advice && (
          <div className="bg-cyan-500/5 p-4 rounded-xl border border-cyan-500/20 flex gap-4 items-center">
            <div className="text-cyan-500">
              <Heart size={20} fill="currentColor" className="opacity-50" />
            </div>
            <p className="text-xs text-slate-300 leading-tight">
              <span className="font-bold text-cyan-400 uppercase tracking-tighter mr-2">Oracle Suggestion:</span>
              {lot.advice}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
