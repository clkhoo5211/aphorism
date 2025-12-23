import { Terminal, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6 relative">
        <Link to="/" className="absolute left-4 md:left-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative">
              <Cpu className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <div className="absolute inset-0 bg-cyan-400/20 blur-sm rounded-full scale-150 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-slate-100 group-hover:text-cyan-400 transition-colors">
              TECHY<span className="text-cyan-400 group-hover:text-slate-100 transition-colors">REFLECT</span>
            </span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-cyan-400 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`
            }
          >
            FEED / ARCHIVE
          </NavLink>
          <NavLink
            to="/tarot"
            className={({ isActive }) =>
              `transition-colors hover:text-purple-400 ${isActive ? 'text-purple-400' : 'text-slate-400'}`
            }
          >
            TAROT INTERLINK
          </NavLink>
          <NavLink
            to="/divination"
            className={({ isActive }) =>
              `transition-colors hover:text-cyan-400 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`
            }
          >
            DIVINATION MATRIX
          </NavLink>
          {/* Temporarily commented out */}
          {/* <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors cursor-not-allowed">RESOURCES</a> */}
        </nav>

        {/* Temporarily commented out */}
        {/* <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest hover:bg-cyan-500/20 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            <Terminal className="h-4 w-4" />
            Connect
          </motion.button>
        </div> */}
      </div>
    </header>
  );
};
