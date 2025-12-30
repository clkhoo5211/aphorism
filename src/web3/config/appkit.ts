import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import { bscMainnet } from '@/web3/config/chains'

// 创建 React Query 客户端
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5分钟
      retry: 2,
    },
  },
})

// Reown AppKit Project ID
// Get yours at: https://cloud.reown.com/appkit
export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID'

// Validate Project ID is set (only log error if not set)
if (projectId === 'YOUR_PROJECT_ID' && typeof window !== 'undefined') {
  console.error('[Reown AppKit] ⚠️ Project ID is not set! Set VITE_REOWN_PROJECT_ID in your .env file');
}

// Get current origin for domain whitelist validation
const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
const originWithSlash = currentOrigin.endsWith('/') ? currentOrigin : `${currentOrigin}/aphorism/`

// 应用元数据
// Use origin with trailing slash for metadata URL as per Reown requirements
// NOTE: Binance Web3 Wallet is VERY strict about metadata validation:
// 1. Icons MUST be accessible (HTTPS, no CORS errors)
// 2. URL MUST match the whitelisted domain exactly
// 3. Icons should be local (same origin) for best compatibility
// 4. Description should be clear and not contain suspicious keywords
export const appMetadata = {
  name: 'Techy Reflect',
  description: 'Digital wisdom interface with tarot card readings and Chinese divination systems',
  url: originWithSlash, // Use trailing slash format for Reown dashboard compatibility
  icons: [
    // Use local icons ONLY (Binance Wallet requires same-origin icons)
    // External CDN icons may cause "connection declined" errors
    `${originWithSlash}vite.svg`,
    `${originWithSlash}pwa-192x192.png`,
    `${originWithSlash}pwa-512x512.png`,
  ],
}

// 只支持BNB智能链网络 (主网和测试网) + 本地Hardhat节点 (用于开发测试)
// Only support BNB Smart Chain networks (mainnet and testnet) + Local Hardhat node (for development)
// Type assertion to satisfy AppKit's non-empty array requirement
// Build networks array: defaultChain first, then other supported chains (avoiding duplicates)
// 
// TEMPORARILY COMMENTED OUT: Hardhat and testnet are hidden to fix Binance Wallet connection issues
// Binance Wallet is strict and will decline connections if non-mainnet networks are present
// const otherChains = supportedChains.filter(chain => chain.id !== defaultChain.id)
// export const networks: [typeof defaultChain, ...typeof supportedChains] = [
//   defaultChain,        // Default chain (Hardhat Local in dev, BSC Mainnet in prod)
//   ...otherChains,      // Other supported chains (excluding default to avoid duplicates)
// ] as [typeof defaultChain, ...typeof supportedChains]

// TEMPORARY FIX: Only show BSC Mainnet for Binance Wallet compatibility
export const networks: [typeof bscMainnet] = [
  bscMainnet,          // Only BSC Mainnet - required for Binance Wallet compatibility
] as [typeof bscMainnet]

// Wagmi 适配器配置
// Configure custom RPC URLs to avoid rate limiting
// These RPCs will be used for gas estimation and contract reads
// The wallet will use its own RPC for sending transactions (which is fine)
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false, // 如需服务端渲染，请设为true
  // Note: Custom RPC URLs are configured in the chain definitions
  // The wallet (MetaMask, etc.) will use its own RPC for sending transactions
  // We use multiple RPC endpoints for reads/gas estimation to avoid rate limits
})

// Wallet IDs for wallets that support BNB Smart Chain
// Get wallet IDs from: https://explorer.walletconnect.com/ or WalletGuide
// 
// TROUBLESHOOTING: If Binance Wallet shows "connection declined":
// Common causes and solutions:
// 1. Domain not whitelisted: Ensure domain is whitelisted at https://dashboard.reown.com
//    - Must match EXACTLY (with/without trailing slash, www vs non-www)
//    - Wait 2+ hours for propagation after whitelisting
// 2. Project ID mismatch: Verify VITE_REOWN_PROJECT_ID matches the project where domain was added
// 3. Metadata validation: Binance Wallet is strict about:
//    - Icons MUST be accessible (HTTPS, same origin preferred)
//    - URL must match whitelisted domain exactly
//    - Description should be in English (Chinese may trigger security flags)
// 4. Network configuration: Only BSC Mainnet (Chain ID 56) is supported
//    - Testnet or other networks will cause "connection declined"
// 5. Wallet ID: Verify at https://explorer.walletconnect.com/ (should be: 8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4)
// 6. Clear cache: Clear browser/wallet cache and try again
// 7. Update wallet: Ensure Binance Web3 Wallet app is updated to latest version
const BNB_CHAIN_WALLET_IDS = {
  METAMASK: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  TRUST_WALLET: '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
  SAFEPAL: '0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150',
  TOKEN_POCKET: '20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66',
  OKX_WALLET: '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
  // Binance Web3 Wallet - if connection is declined, verify this ID at explorer.walletconnect.com
  BINANCE_WEB3: '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4',
  BITGET: 'afbd95522f4041c71dd4f1a065f971a364f034b2452b2f893e20ec8f67a6b295',
  MATH_WALLET: '7674bb4e353bf52886768a3ddc2a4562ce2f4191c80831291218ebd90f5f5e26',
  COIN98: '2a3c89040ac3b723a1972a33a14b4482ccdaa10c5a84a1722aec990c8c4c6c17',
  // Backpack now supports BNB Chain! (Added in 2024)
  // See: https://learn.backpack.exchange/blog/backpack-wallet-bnb-chain-support
  BACKPACK: '4e6af4201629a5b5e56a9561ece762a9bc1a6096e88a706a7f0882a042de5c86',
} as const

// Wallet IDs for wallets that DO NOT support BNB Smart Chain (to be excluded)
// These wallets are primarily for other chains (Solana, etc.) and should be hidden
const NON_BNB_CHAIN_WALLET_IDS = {
  // Solana-only wallets (no BNB Chain support)
  PHANTOM: 'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
  SOLFLARE: '1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79',
  GLOW: 'dd43441a6368ec2d33d13cf7af9a1167b96c5c18e4ae82a1f58ebca61ca44fa1',
  
  // Other wallets to exclude
  COINBASE: 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
  RAINBOW: '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
} as const

// 创建 AppKit 实例
// NOTE: "Invalid App Configuration" UI error (APKT002) can appear even if domain is whitelisted if:
// 1. Project ID in code doesn't match the project where domain was added
// 2. Domain format mismatch (with/without trailing slash, www vs non-www)
// 3. Cache/propagation delay (though 2+ hours should be enough)
// This error is a WARNING and won't block wallet connections - it's safe to ignore
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: appMetadata,
  // Suppress domain whitelist errors in development (they're just warnings)
  // The error will still appear but won't block functionality
  // In production, ensure the domain is properly whitelisted at https://dashboard.reown.com
  themeMode: 'light',
  themeVariables: {
    // Z-index to ensure modal appears above other elements
    // See: https://docs.reown.com/appkit/react/core/theming
    '--apkt-z-index': 999999,
    
    // Primary accent color - matches website blue (#137FEC)
    '--apkt-accent': '#137FEC',
    
    // Color mixing for backgrounds
    '--apkt-color-mix': '#137FEC',
    '--apkt-color-mix-strength': 10,
    
    // Border radius - larger for rounded pill-style buttons
    '--apkt-border-radius-master': '4px',
    
    // Font family - matches website fonts
    '--apkt-font-family': "'Figtree', 'HONOR Sans CN', system-ui, -apple-system, sans-serif",
  },
  features: {
    analytics: false, // Disable analytics to prevent logger initialization errors
    // Only show wallet connection method, hide email and social options
    // connectMethodsOrder: ['wallet'],
  },
  // Hide the "Haven't got a wallet? Get started" guide text
  // NOTE: This may not hide the question mark icon - that's a known AppKit limitation
  enableWalletGuide: true,
  // Completely disable Coinbase connector to prevent analytics SDK errors
  // This stops the Coinbase SDK from loading which causes ERR_BLOCKED_BY_CLIENT
  // errors when ad blockers block requests to cca-lite.coinbase.com
  enableCoinbase: false,
  
  // NOTE: EIP-6963 detects ALL installed browser extension wallets automatically
  // This means Backpack/Phantom will show if installed, but they won't work on BNB Chain
  // Set to false to hide ALL browser wallets (users connect via WalletConnect QR instead)
  // Set to true to show installed wallets like MetaMask directly (recommended for better UX)
  enableInjected: true,
  enableMobileFullScreen: false,
  enableReconnect: true, // Enable auto reconnect for better UX
  // Featured wallets shown at the top of the modal (BNB Chain compatible only)
  // Show ALL BNB-compatible wallets as featured since we're hiding the "All Wallets" view
  featuredWalletIds: [
    BNB_CHAIN_WALLET_IDS.METAMASK,
    BNB_CHAIN_WALLET_IDS.TRUST_WALLET,
    BNB_CHAIN_WALLET_IDS.BINANCE_WEB3,
    BNB_CHAIN_WALLET_IDS.OKX_WALLET,
    BNB_CHAIN_WALLET_IDS.BACKPACK,      // Backpack now supports BNB Chain!
    BNB_CHAIN_WALLET_IDS.SAFEPAL,
    BNB_CHAIN_WALLET_IDS.TOKEN_POCKET,
    BNB_CHAIN_WALLET_IDS.BITGET,
    BNB_CHAIN_WALLET_IDS.MATH_WALLET,
    BNB_CHAIN_WALLET_IDS.COIN98,
  ],
  
  // ONLY allow wallets that support BNB Smart Chain
  // This restricts the wallet list to ONLY these wallets
  includeWalletIds: [
    BNB_CHAIN_WALLET_IDS.METAMASK,
    BNB_CHAIN_WALLET_IDS.TRUST_WALLET,
    BNB_CHAIN_WALLET_IDS.SAFEPAL,
    BNB_CHAIN_WALLET_IDS.TOKEN_POCKET,
    BNB_CHAIN_WALLET_IDS.OKX_WALLET,
    BNB_CHAIN_WALLET_IDS.BINANCE_WEB3,
    BNB_CHAIN_WALLET_IDS.BITGET,
    BNB_CHAIN_WALLET_IDS.MATH_WALLET,
    BNB_CHAIN_WALLET_IDS.COIN98,
    BNB_CHAIN_WALLET_IDS.BACKPACK,      // Backpack now supports BNB Chain!
  ],
  
  // EXCLUDE wallets that don't support BNB Smart Chain
  excludeWalletIds: [
    NON_BNB_CHAIN_WALLET_IDS.PHANTOM,   // Phantom is still Solana-only
    NON_BNB_CHAIN_WALLET_IDS.SOLFLARE,
    NON_BNB_CHAIN_WALLET_IDS.GLOW,
    NON_BNB_CHAIN_WALLET_IDS.COINBASE,
    NON_BNB_CHAIN_WALLET_IDS.RAINBOW,
  ],
  
  // Show "All Wallets" button to allow users to browse all BNB-compatible wallets
  // The includeWalletIds option ensures only BNB Chain wallets are shown
  allWallets: 'SHOW',
})

// 导出配置对象
export const web3Config = {
  queryClient,
  wagmiAdapter,
  wagmiConfig: wagmiAdapter.wagmiConfig,
  appKit,
  projectId,
  networks,
  metadata: appMetadata,
}
