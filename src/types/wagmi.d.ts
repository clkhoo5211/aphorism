// Type declarations for wagmi hooks that are missing from type definitions
// This is a workaround for wagmi v3.1.2 type definition issues
// The hooks exist at runtime but TypeScript can't find the type definitions

declare module 'wagmi' {
  import type React from 'react'
  
  // These hooks exist at runtime - declare them here for TypeScript
  export function useReadContract<T = any>(config?: any): any
  export function useWriteContract(): any
  export function useWaitForTransactionReceipt(config?: { hash?: `0x${string}`, query?: any }): any
  export function usePublicClient(config?: { chainId?: number }): any
  export function useConnection(): any
  export function useChainId(): number | undefined
  export function useSendTransaction(): any
  
  // Provider component
  export const WagmiProvider: React.ComponentType<{ config: any; children: React.ReactNode }>
  
  // Re-export other wagmi exports (these should exist)
  export * from '@wagmi/core'
}
