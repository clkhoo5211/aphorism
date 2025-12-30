/**
 * Compatibility hook for useChainId - uses wagmi v3's useConnection
 * to get chainId since useChainId hook doesn't exist in v3
 */
import { useConnection } from 'wagmi'

export function useChainId(): number | undefined {
  const connection = useConnection()
  return connection?.chainId
}

