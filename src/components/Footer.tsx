export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/50 py-6 sm:py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs sm:text-sm text-slate-500 font-mono tracking-widest uppercase">
          &copy; 2025 TECHYREFLECT SYSTEM v1.0.4. PROCESSED BY AG-AI
        </p>
        <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
          <a href="#" className="text-xs text-slate-600 hover:text-cyan-400 transition-colors font-mono">ENCRYPTION</a>
          <a href="#" className="text-xs text-slate-600 hover:text-cyan-400 transition-colors font-mono">PROTOCOL</a>
          <a href="#" className="text-xs text-slate-600 hover:text-cyan-400 transition-colors font-mono">NODES</a>
        </div>
      </div>
    </footer>
  );
};
