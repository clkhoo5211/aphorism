/**
 * Compatibility hook for useBalance - uses wagmi v3's public client
 * to fetch balance since useBalance hook doesn't exist in v3
 */
import { usePublicClient } from 'wagmi'
import { useAccount } from './useAccount'
import { useState, useEffect } from 'react'
import type { Address } from 'viem'
import { formatUnits } from 'viem'

export interface UseBalanceReturn {
  data?: {
    value: bigint
    decimals: number
    symbol: string
    formatted: string
  }
  isLoading?: boolean
  error?: Error
}

export function useBalance(config?: { address?: Address; chainId?: number }): UseBalanceReturn {
  const { address: accountAddress } = useAccount()
  const address = (config?.address || accountAddress) as Address | undefined
  const chainId = config?.chainId
  const publicClient = usePublicClient({ chainId })
  
  const [balance, setBalance] = useState<bigint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (!address || !publicClient) {
      setBalance(null)
      return
    }

    let cancelled = false

    const fetchBalance = async () => {
      setIsLoading(true)
      setError(undefined)
      try {
        const value = await publicClient.getBalance({ address })
        if (!cancelled) {
          setBalance(value)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchBalance()

    // Poll for balance updates
    const interval = setInterval(fetchBalance, 10000) // Update every 10 seconds

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [address, publicClient])

  if (!address || !publicClient) {
    return { data: undefined, isLoading: false }
  }

  if (error) {
    return { data: undefined, isLoading: false, error }
  }

  if (balance === null) {
    return { data: undefined, isLoading }
  }

  // Get chain info for symbol
  const chain = publicClient.chain
  const decimals = 18 // Most chains use 18 decimals
  const symbol = chain?.nativeCurrency?.symbol || 'ETH'

  return {
    data: {
      value: balance,
      decimals,
      symbol,
      formatted: formatUnits(balance, decimals),
    },
    isLoading,
  }
}

