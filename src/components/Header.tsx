import { useState } from 'react';
import { Cpu, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';
import { ConnectWalletButton } from '@/web3/components/ConnectWalletButton';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 relative">
        <Link to="/" className="flex-shrink-0" onClick={closeMobileMenu}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="relative">
              <Cpu className="h-6 w-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <div className="absolute inset-0 bg-cyan-400/20 blur-sm rounded-full scale-150 animate-pulse" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tighter text-slate-100 group-hover:text-cyan-400 transition-colors">
              TECHY<span className="text-cyan-400 group-hover:text-slate-100 transition-colors">REFLECT</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
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
          <NavLink
            to="/tip"
            className={({ isActive }) =>
              `transition-colors hover:text-amber-400 ${isActive ? 'text-amber-400' : 'text-slate-400'}`
            }
          >
            TIP COFFEE
          </NavLink>
        </nav>

        {/* Desktop Connect Button */}
        <div className="hidden md:flex items-center gap-4">
          <ConnectWalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-slate-400 hover:text-cyan-400 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md"
          >
            <div className="flex flex-col py-4 px-4 space-y-4">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-bold tracking-widest transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-900/50'
                  }`
                }
              >
                FEED / ARCHIVE
              </NavLink>
              <NavLink
                to="/tarot"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-bold tracking-widest transition-colors ${
                    isActive
                      ? 'text-purple-400 bg-purple-400/10 border border-purple-500/30'
                      : 'text-slate-400 hover:text-purple-400 hover:bg-slate-900/50'
                  }`
                }
              >
                TAROT INTERLINK
              </NavLink>
              <NavLink
                to="/divination"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-bold tracking-widest transition-colors ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-900/50'
                  }`
                }
              >
                DIVINATION MATRIX
              </NavLink>
              <NavLink
                to="/tip"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-bold tracking-widest transition-colors ${
                    isActive
                      ? 'text-amber-400 bg-amber-400/10 border border-amber-500/30'
                      : 'text-slate-400 hover:text-amber-400 hover:bg-slate-900/50'
                  }`
                }
              >
                TIP COFFEE
              </NavLink>
              {/* Mobile Connect Button */}
              <div className="pt-2 border-t border-slate-800">
                <ConnectWalletButton />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
