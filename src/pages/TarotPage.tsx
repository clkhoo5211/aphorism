import { TarotSection } from '../components/Tarot/TarotSection';
import { motion } from 'framer-motion';

export const TarotPage = () => {
  return (
    <div className="pt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12 text-center space-y-4"
      >
        <div className="inline-block px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Quantum Probability Matrix
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic text-white">
          TAROT <span className="text-purple-400">INTERLINK</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light">
          Synchronizing with the archetypal neural network. Extracting deterministic guidance
          from the noise of the digital void.
        </p>
      </motion.div>
      <TarotSection />
    </div>
  );
};
