// Re-export useAccount compatibility hook
export { useAccount } from '@/web3/hooks/useAccount'
export type { UseAccountReturn } from '@/web3/hooks/useAccount'

// Re-export all hooks from useAppKit
export {
  useAppKitWallet,
  useNetworks,
  useTokenBalance,
  formatBalance,
  useWalletEvents,
} from '@/web3/hooks/useAppKit'

// Export useTransaction
export { useTransaction } from '@/web3/hooks/useTransaction'

// Export contract hooks
export {
  useContractRead,
  useContractWrite,
  useContractReadAuto,
} from '@/web3/hooks/useContract'

// Export direct wallet provider hook (most standard method)
export {
  useContractWriteDirect,
} from '@/web3/hooks/useContractDirect'

// Type exports
export type { WalletInfo, NetworkInfo } from '@/web3/hooks/useAppKit'
export type { SendTransactionParams, TransactionState, GasEstimate, UseTransactionReturn } from '@/web3/hooks/useTransaction'
export type {
  UseContractReadConfig,
  UseContractWriteConfig,
  ContractWriteCallbacks,
  UseContractReadReturn,
  UseContractWriteReturn,
} from '@/web3/hooks/useContract'

// Re-export useAppKitWallet as named export
import { useAppKitWallet, useTokenBalance as useTokenBalanceOriginal } from '@/web3/hooks/useAppKit'

// Wrapper hook for WalletConnectExample compatibility
// Returns { account, wallet, chain } structure
export function useWalletConnect() {
  const wallet = useAppKitWallet()
  
  return {
    account: {
      isConnected: wallet.isConnected,
      address: wallet.address,
    },
    wallet: {
      name: wallet.connector || 'Unknown Wallet',
      icon: undefined, // Will be populated by actual connector
    },
    chain: {
      id: wallet.chainId,
      name: wallet.chainName,
      isSupported: true,
    },
    // Also expose raw data
    ...wallet,
  }
}

// Token balance type for useBalance
export interface TokenBalanceInfo {
  token: {
    address: `0x${string}`
    symbol: string
    name: string
    decimals: number
  }
  balance: string
  formatted: string
  value: number
  change: number
  icon?: string
}

// Wrapper hook for balance with token support
export function useBalance(_options?: { includeTokens?: boolean }) {
  const { address } = useAppKitWallet()
  const { nativeBalance } = useTokenBalanceOriginal(address as `0x${string}`)
  
  return {
    nativeBalance: nativeBalance ? {
      value: nativeBalance.value,
      formatted: nativeBalance.formatted,
      symbol: nativeBalance.symbol,
      decimals: nativeBalance.decimals,
    } : null,
    tokenBalances: [] as TokenBalanceInfo[], // Empty array - would need token list to populate
    totalValue: nativeBalance ? parseFloat(nativeBalance.formatted) : 0,
  }
}

