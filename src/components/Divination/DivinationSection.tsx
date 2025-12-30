import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DivinationLotCard } from './DivinationLotCard';
import { DivinationCylinder } from './DivinationCylinder';
import type { DivinationLot } from '../../data/divinationData';
import { drawRandomLot, drawPersonalizedLot, getOracleStats } from '../../utils/divinationLogic';
import { Send, RefreshCw, Sparkles } from 'lucide-react';

export const DivinationSection: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [lot, setLot] = useState<DivinationLot | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stats, setStats] = useState({ totalLots: 0, systems: { guanyin: 0, chinese: 0, japanese: 0 } });

  useEffect(() => {
    setStats(getOracleStats());
  }, []);

  const handleDraw = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isDrawing) return;

    setIsDrawing(true);
    setLot(null);

    // Simulate "quantum calculation" delay
    setTimeout(() => {
      const result = question.trim() ? drawPersonalizedLot(question) : drawRandomLot();
      setLot(result);
      setIsDrawing(false);
    }, 1500);
  };

  const handleReset = () => {
    setLot(null);
    setQuestion('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6">
      <div className="flex flex-col items-center space-y-12">
        {/* Intro Section */}
        {!lot && !isDrawing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 max-w-2xl w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs uppercase tracking-[0.3em]">
              <Sparkles size={16} className="animate-pulse" />
              Universal Oracle Matrix
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Unified Oracle</span>
            </h1>
            <p className="text-slate-400 font-light leading-relaxed">
              Drawing from <span className="text-cyan-400 font-bold">{stats.totalLots}+ sacred lots</span> across all Chinese and Japanese divination traditions.
              One question, infinite wisdom from multiple divine sources.
            </p>

            {/* System List */}
            <div className="space-y-3 text-left bg-slate-900/30 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span><strong className="text-cyan-400">观音灵签</strong> - Compassionate guidance</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span><strong className="text-yellow-400">黄大仙</strong> - Career & wealth wisdom</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                <span><strong className="text-pink-400">月老</strong> - Love & marriage</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span><strong className="text-purple-400">吕祖</strong> - Spiritual enlightenment</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span><strong className="text-blue-400">妈祖</strong> - Protection & travel</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span><strong className="text-rose-400">浅草寺</strong> - Japanese Buddhist tradition</span>
              </div>
            </div>

            <form onSubmit={handleDraw} className="mt-6 sm:mt-8 relative group">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Pose your question to the unified oracle..."
                className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 pr-24 sm:pr-28 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all font-light text-sm sm:text-base"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-4 sm:px-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 active:scale-95 text-white rounded-xl font-black uppercase text-[10px] sm:text-xs tracking-widest transition-all flex items-center gap-1 sm:gap-2 shadow-lg shadow-cyan-500/20 touch-manipulation"
              >
                Draw Lot
                <Send size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
            </form>

            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
              Unified Oracle • {stats.totalLots}+ Lots from 6 Sacred Traditions
            </p>
          </motion.div>
        )}

        {/* Drawing Animation */}
        <AnimatePresence>
          {isDrawing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-6 py-20"
            >
              <DivinationCylinder isShaking={isDrawing} />
              <p className="font-mono text-xs text-amber-600 uppercase tracking-[0.4em] animate-pulse">
                Consulting All Oracles...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Section */}
        <AnimatePresence>
          {lot && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center space-y-8"
            >
              <DivinationLotCard lot={lot} />

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-mono text-[10px] uppercase tracking-[0.2em]"
              >
                <RefreshCw size={14} />
                Consult Oracle Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
