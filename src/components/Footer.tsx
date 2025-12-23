export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/50 py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-500 font-mono tracking-widest uppercase">
          &copy; 2025 TECHYREFLECT SYSTEM v1.0.4. PROCESSED BY AG-AI
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="text-xs text-slate-600 hover:text-cyan-400 transition-colors font-mono">ENCRYPTION</a>
          <a href="#" className="text-xs text-slate-600 hover:text-cyan-400 transition-colors font-mono">PROTOCOL</a>
          <a href="#" className="text-xs text-slate-600 hover:text-cyan-400 transition-colors font-mono">NODES</a>
        </div>
      </div>
    </footer>
  );
};
