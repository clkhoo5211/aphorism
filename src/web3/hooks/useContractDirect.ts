/**
 * Direct contract write hook using Wagmi's writeContractAsync
 * This is the standard method for sending transactions and triggering wallet popups
 */

import { useState, useCallback, useEffect } from 'react'
import { useWriteContract } from 'wagmi'
import { useAccount } from './useAccount'
import type { Address, Abi } from 'viem'

// ============================================
// TYPES
// ============================================

export interface DirectContractWriteConfig {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: Abi
  /** Function name to call */
  functionName: string
  /** Function arguments */
  args?: readonly unknown[]
  /** Value to send with transaction (in wei) */
  value?: bigint
  /** Gas limit (optional) */
  gas?: bigint
}

export interface DirectContractWriteCallbacks {
  onSuccess?: (hash: `0x${string}`) => void
  onError?: (error: Error) => void
  onConfirmed?: (receipt: any) => void
}

export interface DirectContractWriteReturn {
  write: (config: DirectContractWriteConfig, callbacks?: DirectContractWriteCallbacks) => Promise<void>
  writeAsync: (config: DirectContractWriteConfig, callbacks?: DirectContractWriteCallbacks) => Promise<`0x${string}` | undefined>
  hash: `0x${string}` | undefined
  receipt: any | undefined
  isPending: boolean
  isConfirming: boolean
  isSuccess: boolean
  isError: boolean
  error: Error | null
  reset: () => void
}

// ============================================
// DIRECT CONTRACT WRITE HOOK
// ============================================

/**
 * Direct contract write hook using Wagmi
 * 
 * @example
 * ```tsx
 * const { write, isPending, hash } = useContractWriteDirect()
 * 
 * await write({
 *   address: '0x...',
 *   abi: ERC20_ABI,
 *   functionName: 'transfer',
 *   args: ['0x...', parseUnits('100', 18)],
 * })
 * ```
 */
export function useContractWriteDirect(): DirectContractWriteReturn {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined)
  const [receipt, setReceipt] = useState<any | undefined>(undefined)
  const [isPending, setIsPending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [callbacks, setCallbacks] = useState<DirectContractWriteCallbacks | null>(null)

  // Wait for transaction confirmation
  useEffect(() => {
    if (!hash || !isConnected) return

    setIsConfirming(true)
    const checkConfirmation = async () => {
      try {
        const provider = (window as any).ethereum
        if (!provider) return

        const txReceipt = await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [hash],
        })

        if (txReceipt) {
          setIsConfirming(false)
          setIsSuccess(true)
          setIsPending(false)
          setReceipt(txReceipt)
          callbacks?.onConfirmed?.(txReceipt)
        } else {
          // Poll every 2 seconds
          setTimeout(checkConfirmation, 2000)
        }
      } catch (err) {
        setIsConfirming(false)
        setIsError(true)
        setError(err as Error)
        callbacks?.onError?.(err as Error)
      }
    }

    checkConfirmation()
  }, [hash, isConnected, callbacks])

  // Write function - uses wallet provider directly
  const write = useCallback(
    async (
      config: DirectContractWriteConfig,
      writeCallbacks?: DirectContractWriteCallbacks
    ) => {
      if (!isConnected || !address) {
        const err = new Error('Wallet not connected. Please connect your wallet first.')
        setError(err)
        writeCallbacks?.onError?.(err)
        return
      }

      setCallbacks(writeCallbacks || null)
      setError(null)
      setIsPending(true)
      setIsError(false)
      setIsSuccess(false)
      setHash(undefined)
      setReceipt(undefined)

      try {
        const { address: contractAddress, abi, functionName, args = [], value = 0n } = config

        const txHash = await writeContractAsync({
          address: contractAddress,
          abi,
          functionName,
          args,
          value,
        })

        if (!txHash || typeof txHash !== 'string' || !txHash.startsWith('0x')) {
          throw new Error(`Invalid transaction hash returned: ${txHash}`)
        }

        setHash(txHash)
        setIsPending(false)
        writeCallbacks?.onSuccess?.(txHash)
      } catch (err: any) {
        setIsPending(false)
        setIsError(true)

        // Parse error with detailed information
        let errorMessage = 'Transaction failed.'
        
        // Check various error formats
        const errorMsg = err?.message || err?.error?.message || err?.data?.message || err?.error?.data?.message || ''
        const errorCode = err?.code || err?.error?.code || err?.data?.code
        
        // Error code -32003 = Transaction creation failed (usually means transaction would revert)
        if (errorCode === -32003) {
          errorMessage = 'Transaction would fail. Common causes:\n' +
            '1. Insufficient USDT balance in your wallet\n' +
            '2. Insufficient BNB for gas fees\n' +
            '3. Invalid recipient address\n' +
            '4. Contract would reject the transaction\n\n' +
            'Please check your balance and try again.'
        } else if (errorCode === 4001 || errorMsg.toLowerCase().includes('user rejected') || errorMsg.toLowerCase().includes('user denied')) {
          errorMessage = 'Transaction cancelled. You rejected the transaction in your wallet.'
        } else if (errorCode === -32603 || errorMsg.toLowerCase().includes('execution reverted') || errorMsg.toLowerCase().includes('revert')) {
          errorMessage = `Transaction would fail: ${errorMsg || 'Contract execution would revert. Check your balance and parameters.'}`
        } else if (errorMsg.toLowerCase().includes('insufficient funds') || errorMsg.toLowerCase().includes('insufficient balance')) {
          errorMessage = 'Insufficient balance. You don\'t have enough tokens or BNB for gas fees.'
        } else if (errorMsg.toLowerCase().includes('rate limit') || errorMsg.toLowerCase().includes('exceeds defined limit')) {
          errorMessage = 'Network is busy (rate limited). Please wait 10-30 seconds and try again, or update your wallet\'s RPC endpoint.'
        } else if (errorMsg) {
          errorMessage = errorMsg
        } else if (err?.toString && err.toString() !== '[object Object]') {
          errorMessage = err.toString()
        } else {
          // Try to extract any useful information
          const errorStr = JSON.stringify(err, Object.getOwnPropertyNames(err))
          errorMessage = `Transaction failed (Error code: ${errorCode || 'unknown'}). ${errorStr.length > 200 ? errorStr.substring(0, 200) + '...' : errorStr}`
        }

        const error = new Error(errorMessage)
        // Preserve original error in stack
        if (err?.stack) {
          error.stack = err.stack
        }
        setError(error)
        writeCallbacks?.onError?.(error)
      }
    },
    [isConnected, address, writeContractAsync]
  )

  // Async version
  const writeAsync = useCallback(
    async (
      config: DirectContractWriteConfig,
      writeCallbacks?: DirectContractWriteCallbacks
    ): Promise<`0x${string}` | undefined> => {
      return new Promise((resolve, reject) => {
        write(config, {
          ...writeCallbacks,
          onSuccess: (hash) => {
            writeCallbacks?.onSuccess?.(hash)
            resolve(hash)
          },
          onError: (error) => {
            writeCallbacks?.onError?.(error)
            reject(error)
          },
        })
      })
    },
    [write]
  )

  // Reset function
  const reset = useCallback(() => {
    setHash(undefined)
    setReceipt(undefined)
    setIsPending(false)
    setIsConfirming(false)
    setIsSuccess(false)
    setIsError(false)
    setError(null)
    setCallbacks(null)
  }, [])

  return {
    write,
    writeAsync,
    hash,
    receipt,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    reset,
  }
}

