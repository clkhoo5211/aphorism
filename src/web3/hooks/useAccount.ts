/**
 * Compatibility hook for useAccount - wraps wagmi v3's useConnection
 * to provide the same API as wagmi v2's useAccount
 * 
 * In wagmi v3, useAccount was replaced by useConnection which returns:
 * { accounts: readonly [Address, ...Address[]], chainId: number, connector: Connector }
 */
import { useConnection, useChainId } from 'wagmi'

export interface UseAccountReturn {
  address?: `0x${string}`
  chainId?: number
  connector?: any
  isConnected: boolean
  isConnecting: boolean
  isDisconnected: boolean
  status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting'
}

/**
 * Compatibility hook that maps useConnection to useAccount API
 * Uses useChainId() as fallback for chainId when connection is not available
 */
export function useAccount(): UseAccountReturn {
  const connection = useConnection()
  const chainId = useChainId() // Use useChainId as fallback for chainId
  
  // Map Connection object to Account-like structure
  // connection.accounts is an array, first element is the address
  const address = connection?.accounts?.[0] as `0x${string}` | undefined
  
  // Prefer chainId from connection, fallback to useChainId()
  const finalChainId = connection?.chainId ?? chainId
  
  return {
    address,
    chainId: finalChainId,
    connector: connection?.connector,
    isConnected: !!address,
    isConnecting: false, // Connection doesn't expose status, we assume connected if address exists
    isDisconnected: !address,
    status: address ? 'connected' : 'disconnected',
  }
}

