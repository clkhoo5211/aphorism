import { motion } from 'framer-motion';
import { Copy, Check, Coffee, Wallet, ExternalLink } from 'lucide-react';
import { useState } from 'react';

// Get wallet address from environment variable
const WALLET_ADDRESS = import.meta.env.VITE_WALLET_ADDRESS;

const EVM_CHAINS = [
  { name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io/address/' },
  { name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com/address/' },
  { name: 'BNB Chain', symbol: 'BNB', explorer: 'https://bscscan.com/address/' },
  { name: 'Arbitrum', symbol: 'ETH', explorer: 'https://arbiscan.io/address/' },
  { name: 'Optimism', symbol: 'ETH', explorer: 'https://optimistic.etherscan.io/address/' },
  { name: 'Avalanche', symbol: 'AVAX', explorer: 'https://snowtrace.io/address/' },
  { name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org/address/' },
  { name: 'Fantom', symbol: 'FTM', explorer: 'https://ftmscan.com/address/' },
];

export const TipPage = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4"
          >
            <Coffee className="w-10 h-10 text-amber-400" />
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter px-2">
            TIP ME A <span className="text-amber-400">COFFEE</span>
          </h1>
          
          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4">
            If you find value in this project, consider supporting its development. 
            Your contributions help keep this platform running and evolving.
          </p>
        </div>

        {/* Wallet Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">EVM-Compatible Wallet Address</h2>
          </div>
          
          <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">
            Supports all EVM-compatible chains and tokens
          </p>

          {/* Address Display */}
          <div className="bg-slate-950/80 border border-slate-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between gap-4">
              <code className="text-sm md:text-base font-mono text-cyan-400 break-all">
                {WALLET_ADDRESS}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-xs font-bold uppercase tracking-wider"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Supported Chains */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
              Supported EVM Chains
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {EVM_CHAINS.map((chain) => (
                <motion.a
                  key={chain.name}
                  href={`${chain.explorer}${WALLET_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-amber-500/30 hover:bg-slate-800 transition-all group"
                >
                  <span className="text-xs font-medium text-slate-300 group-hover:text-amber-400 transition-colors">
                    {chain.name}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            How to Send
          </h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">1.</span>
              <span>Copy the wallet address above</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">2.</span>
              <span>Open your wallet (MetaMask, Trust Wallet, etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">3.</span>
              <span>Select any EVM-compatible network (Ethereum, Polygon, BNB Chain, etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">4.</span>
              <span>Send any supported token (ETH, USDT, USDC, MATIC, BNB, etc.)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-bold mt-0.5">5.</span>
              <span>Confirm the transaction in your wallet</span>
            </li>
          </ul>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center py-8"
        >
          <p className="text-slate-500 text-sm italic">
            Thank you for your support! Every contribution, no matter how small, 
            helps keep this project alive and evolving. 🙏
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

