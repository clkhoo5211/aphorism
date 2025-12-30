import { bsc, bscTestnet, type Chain } from 'viem/chains'

// Local Hardhat network configuration (for development/testing)
// Read chain ID from .env (defaults to 31337 if not set)
const hardhatChainId = parseInt(import.meta.env.VITE_CHAIN_ID || '31337', 10)

export const hardhatLocal: Chain = {
  id: hardhatChainId,
  name: 'Hardhat Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Local',
      url: 'http://localhost:8545',
    },
  },
  testnet: true,
}

// 自定义BNB智能链配置
export const bscMainnet: Chain = {
  ...bsc,
  name: 'BNB Smart Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { 
      http: [
        'https://bsc-dataseed1.binance.org/',
        'https://bsc-dataseed2.binance.org/',
        'https://bsc-dataseed3.binance.org/',
        'https://bsc-dataseed4.binance.org/',
        'https://bsc-dataseed.binance.org/',
        'https://bsc-dataseed1.defibit.io/',
        'https://bsc-dataseed1.ninicoin.io/',
      ] 
    },
    public: { 
      http: [
        'https://bsc-dataseed1.binance.org/',
        'https://bsc-dataseed2.binance.org/',
        'https://bsc-dataseed3.binance.org/',
        'https://bsc-dataseed4.binance.org/',
      ] 
    },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 15824887,
    },
  },
}

// 自定义BNB测试网配置
export const bscTestnetConfig: Chain = {
  ...bscTestnet,
  name: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tBNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] },
    public: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] },
  },
  blockExplorers: {
    default: { name: 'BscScan Testnet', url: 'https://testnet.bscscan.com' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 33232268,
    },
  },
}

// 导出所有支持的链
export const supportedChains = [hardhatLocal, bscMainnet, bscTestnetConfig]

// 默认链 - 使用BSC主网（Hardhat仅用于开发测试）
export const defaultChain = bscMainnet

// 链的元数据映射 - 使用动态链ID
export const chainMetadata: Record<number, { name: string; symbol: string; color: string; iconUrl: string }> = {
  [hardhatLocal.id]: {
    name: hardhatLocal.name,
    symbol: 'ETH',
    color: '#627EEA',
    iconUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1696501628',
  },
  [bscMainnet.id]: {
    name: bscMainnet.name,
    symbol: 'BNB',
    color: '#F3BA2F',
    iconUrl: 'https://assets.coingecko.com/coins/images/12595/small/binance-coin-logo.png?1696511200',
  },
  [bscTestnetConfig.id]: {
    name: bscTestnetConfig.name,
    symbol: 'tBNB',
    color: '#8B5CF6',
    iconUrl: 'https://assets.coingecko.com/coins/images/12595/small/binance-coin-logo.png?1696511200',
  },
}

// Export hardhat chain ID for external use
export const HARDHAT_CHAIN_ID = hardhatChainId