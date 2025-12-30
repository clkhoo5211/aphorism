import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { useAccount } from './useAccount'
import type { Address, Abi } from 'viem'
import { useCallback, useState, useEffect } from 'react'

// ============================================
// ERROR PARSING UTILITY
// ============================================

/**
 * Parses contract errors and returns user-friendly error messages
 */
function parseContractError(error: Error): Error {
  const message = error.message.toLowerCase()
  const errorName = error.name || ''

  // User rejected transaction
  if (
    message.includes('user rejected') ||
    message.includes('user denied') ||
    message.includes('user cancelled') ||
    message.includes('rejected') ||
    errorName.includes('UserRejectedRequestError')
  ) {
    return new Error('Transaction cancelled. You rejected the transaction in your wallet.')
  }

  // Insufficient funds
  if (
    message.includes('insufficient funds') ||
    message.includes('insufficient balance') ||
    message.includes('not enough')
  ) {
    return new Error('Insufficient balance. You don\'t have enough tokens or BNB to complete this transaction.')
  }

  // Rate limit / RPC errors
  if (
    message.includes('rate limit') ||
    message.includes('exceeds defined limit') ||
    message.includes('limitexceeded') ||
    message.includes('too many requests')
  ) {
    return new Error(
      'Network is busy. The RPC endpoint is temporarily rate-limited.\n\n' +
      'Quick Fix:\n' +
      '1. Wait 10-30 seconds and try again\n' +
      '2. Update MetaMask RPC: Settings → Networks → BNB Smart Chain → Edit → RPC URL: https://bsc-dataseed1.binance.org/\n' +
      '3. Try again after updating'
    )
  }

  // Network/Chain mismatch
  if (
    message.includes('wrong network') ||
    message.includes('chain mismatch') ||
    message.includes('network mismatch') ||
    message.includes('unsupported chain')
  ) {
    return new Error(
      'Wrong network. Please switch to BNB Smart Chain Mainnet in your wallet.'
    )
  }

  // Gas estimation errors
  if (
    message.includes('gas') &&
    (message.includes('estimation') || message.includes('revert') || message.includes('execution'))
  ) {
    return new Error(
      'Transaction will fail. The contract function call would revert. ' +
      'Check: 1) You have enough balance, 2) You have approval (for token transfers), 3) Contract address is correct.'
    )
  }

  // Contract execution errors
  if (
    message.includes('execution reverted') ||
    message.includes('revert') ||
    message.includes('contract call') ||
    message.includes('internal json-rpc error')
  ) {
    // Try to extract revert reason if available
    const revertMatch = message.match(/revert\s+(.+)/i) || 
                       message.match(/reason:\s*(.+)/i) ||
                       message.match(/"([^"]+)"/)
    
    // Check if error has data property with revert reason (common in Hardhat)
    const errorData = (error as any)?.data || (error as any)?.cause?.data || (error as any)?.cause?.cause?.data
    
    if (errorData) {
      console.error('[parseContractError] Error data found:', errorData)
      // Try to decode the revert reason from error data
      if (typeof errorData === 'string') {
        // Sometimes the reason is in the error data string
        const dataMatch = errorData.match(/revert\s+(.+)/i) || errorData.match(/reason:\s*(.+)/i)
        if (dataMatch) {
          return new Error(`Transaction failed: ${dataMatch[1]}`)
        }
      }
    }
    
    if (revertMatch) {
      return new Error(`Transaction failed: ${revertMatch[1]}`)
    }
    
    // For Hardhat "Internal JSON-RPC error", provide more helpful message
    if (message.includes('internal json-rpc error')) {
      // Try to extract error details from the error object
      const errorObj = error as any
      let additionalInfo = ''
      
      // Try to get shortMessage or details from viem errors
      if (errorObj.shortMessage) {
        additionalInfo = `\n\nError details: ${errorObj.shortMessage}`
      }
      if (errorObj.details) {
        additionalInfo += `\nDetails: ${JSON.stringify(errorObj.details)}`
      }
      if (errorObj.cause) {
        const cause = errorObj.cause
        if (cause.shortMessage) {
          additionalInfo += `\nCause: ${cause.shortMessage}`
        }
        if (cause.reason) {
          additionalInfo += `\nReason: ${cause.reason}`
        }
        if (cause.data) {
          console.error('[parseContractError] Cause data:', cause.data)
        }
      }
      
      // Check for common Hardhat error patterns
      const fullErrorString = JSON.stringify(errorObj, Object.getOwnPropertyNames(errorObj))
      if (fullErrorString.includes('Token not whitelisted')) {
        return new Error(
          'Transaction failed: Token not whitelisted.\n\n' +
          'The native token (ETH) may need to be whitelisted in the TokenWhitelist contract.\n' +
          'Check your Hardhat node terminal for more details.'
        )
      }
      
      // Build a comprehensive error message
      let errorMsg = 'Transaction failed: The contract rejected the transaction (Internal JSON-RPC error).\n\n'
      
      errorMsg += '🔍 DEBUGGING STEPS:\n'
      errorMsg += '1. Check your Hardhat node terminal (where you ran "npm run node")\n'
      errorMsg += '   → Look for the actual revert reason like:\n'
      errorMsg += '      • "Token not whitelisted"\n'
      errorMsg += '      • "Deposit amount must be greater than 0"\n'
      errorMsg += '      • "Deposit failed" or "ERC20 deposit failed"\n\n'
      
      errorMsg += '2. Common causes and solutions:\n'
      errorMsg += '   • Token whitelist: Native token (address(0)) may not be whitelisted\n'
      errorMsg += '     → Solution: Check TokenWhitelist contract settings\n'
      errorMsg += '   • Insufficient balance: You may not have enough ETH/tokens\n'
      errorMsg += '   • Contract deployment: Contract may not be deployed at configured address\n'
      errorMsg += '   • Function parameters: Check if all parameters are correct\n\n'
      
      errorMsg += '3. Verify contract is deployed:\n'
      errorMsg += '   → Check that ContractDeployer is deployed at: 0x68B1D87F95878fE05B998F19b66F4baba5De1aed\n'
      errorMsg += '   → Verify Hardhat node is running on http://127.0.0.1:8545\n\n'
      
      errorMsg += '💡 The actual revert reason will be in your Hardhat node terminal, not here.'
      
      if (additionalInfo) {
        errorMsg += '\n\n' + additionalInfo
      }
      
      return new Error(errorMsg)
    }
    
    return new Error(
      'Transaction would fail. The contract rejected the transaction. ' +
      'Common reasons: Insufficient balance, missing approval, or invalid parameters.'
    )
  }

  // Connection errors
  if (
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('fetch') ||
    message.includes('timeout')
  ) {
    return new Error(
      'Network error. Unable to connect to the blockchain.\n\n' +
      'Solutions:\n' +
      '1. Check your internet connection\n' +
      '2. Make sure your wallet is connected\n' +
      '3. Try refreshing the page\n' +
      '4. Switch to a different RPC endpoint in your wallet settings'
    )
  }

  // Wallet not connected
  if (
    message.includes('not connected') ||
    message.includes('no provider') ||
    message.includes('wallet not found')
  ) {
    return new Error('Wallet not connected. Please connect your wallet first.')
  }

  // Generic error - return original but cleaned up
  return new Error(
    error.message
      .replace(/ContractFunctionExecutionError:/gi, '')
      .replace(/TransactionExecutionError:/gi, '')
      .replace(/LimitExceededRpcError:/gi, '')
      .replace(/Request Arguments:[\s\S]*?Details:/gi, '')
      .trim() || 'Transaction failed. Please try again or contact support if the problem persists.'
  )
}

// ============================================
// TYPES
// ============================================

/**
 * Contract read configuration
 */
export interface UseContractReadConfig {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: Abi
  /** Function name to call */
  functionName: string
  /** Function arguments (array of values) */
  args?: readonly unknown[]
  /** Chain ID (optional, uses connected chain if not provided) */
  chainId?: number
  /** Enable/disable the query */
  enabled?: boolean
  /** Query key for caching */
  queryKey?: string[]
}

/**
 * Contract write configuration
 */
export interface UseContractWriteConfig {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: Abi
  /** Function name to call */
  functionName: string
  /** Function arguments (array of values) */
  args?: readonly unknown[]
  /** Chain ID (optional, uses connected chain if not provided) */
  chainId?: number
  /** Value to send with transaction (in wei) */
  value?: bigint
  /** Gas limit (optional, will be estimated if not provided) */
  gas?: bigint
}

/**
 * Callbacks for contract write operations
 */
export interface ContractWriteCallbacks {
  /** Called when transaction is sent (receives transaction hash) */
  onSuccess?: (hash: `0x${string}`) => void
  /** Called when transaction fails */
  onError?: (error: Error) => void
  /** Called when transaction is confirmed (receives receipt) */
  onConfirmed?: (receipt: any) => void
}

/**
 * Return type for contract read hook
 */
export interface UseContractReadReturn<T = any> {
  /** The data returned from the contract function */
  data: T | undefined
  /** True if the query is currently loading */
  isLoading: boolean
  /** True if the query is currently refetching */
  isRefetching: boolean
  /** True if the query encountered an error */
  isError: boolean
  /** The error object if the query failed */
  error: Error | null
  /** Function to manually refetch the data */
  refetch: () => void
  /** True if the query is enabled and ready to execute */
  isEnabled: boolean
}

/**
 * Return type for contract write hook
 */
export interface UseContractWriteReturn {
  /** Function to write to the contract */
  write: (config?: Partial<UseContractWriteConfig>, callbacks?: ContractWriteCallbacks) => Promise<void>
  /** Function to write to the contract (async version) */
  writeAsync: (config?: Partial<UseContractWriteConfig>, callbacks?: ContractWriteCallbacks) => Promise<`0x${string}` | undefined>
  /** Transaction hash (if transaction was sent) */
  hash: `0x${string}` | undefined
  /** Transaction receipt (if transaction was confirmed) */
  receipt: any | undefined
  /** True if transaction is pending */
  isPending: boolean
  /** True if transaction is being confirmed */
  isConfirming: boolean
  /** True if transaction was successful */
  isSuccess: boolean
  /** True if transaction failed */
  isError: boolean
  /** Error object if transaction failed */
  error: Error | null
  /** Reset the transaction state */
  reset: () => void
}

// ============================================
// CONTRACT READ HOOK
// ============================================

/**
 * Hook for reading data from smart contracts
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useContractRead({
 *   address: '0x...',
 *   abi: ERC20_ABI,
 *   functionName: 'balanceOf',
 *   args: ['0x...'],
 * })
 * ```
 */
export function useContractRead<T = any>(config: UseContractReadConfig): UseContractReadReturn<T> {
  const { address, abi, functionName, args, chainId, enabled = true, queryKey } = config

  const {
    data,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useReadContract({
    address,
    abi,
    functionName,
    args,
    chainId,
    query: {
      enabled,
      ...(queryKey && { queryKey }),
    },
  })

  return {
    data: data as T | undefined,
    isLoading,
    isRefetching,
    isError,
    error: error as Error | null,
    refetch: refetch as () => void,
    isEnabled: enabled,
  }
}

// ============================================
// CONTRACT WRITE HOOK
// ============================================

/**
 * Hook for writing to smart contracts (sending transactions)
 * 
 * @example
 * ```tsx
 * const { write, isPending, hash, receipt } = useContractWrite({
 *   address: '0x...',
 *   abi: ERC20_ABI,
 *   functionName: 'transfer',
 * })
 * 
 * // Call the function
 * await write({
 *   args: ['0x...', parseUnits('100', 18)],
 * }, {
 *   onSuccess: (hash) => console.log('Tx hash:', hash),
 *   onConfirmed: (receipt) => console.log('Confirmed!', receipt),
 * })
 * ```
 */
export function useContractWrite(config: UseContractWriteConfig): UseContractWriteReturn {
  const { address, abi, functionName, args, chainId, value, gas } = config
  const { isConnected, address: accountAddress } = useAccount()
  const publicClient = usePublicClient({ chainId })
  
  const [callbacks, setCallbacks] = useState<ContractWriteCallbacks | null>(null)
  const [lastError, setLastError] = useState<Error | null>(null)

  const {
    writeContractAsync,
    isPending,
    data: hash,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract()

  // Wait for transaction receipt
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  })

  // Handle transaction confirmation
  useEffect(() => {
    if (isSuccess && receipt && callbacks?.onConfirmed) {
      callbacks.onConfirmed(receipt)
    }
  }, [isSuccess, receipt, callbacks])

  // Handle errors
  useEffect(() => {
    const error = writeError || receiptError
    if (error) {
      const err = error as Error
      setLastError(err)
      callbacks?.onError?.(err)
    }
  }, [writeError, receiptError, callbacks])

  // Write function (with callbacks)
  const write = useCallback(
    async (
      overrideConfig?: Partial<UseContractWriteConfig>,
      writeCallbacks?: ContractWriteCallbacks
    ) => {
      if (!isConnected) {
        const err = new Error('Wallet not connected. Please connect your wallet first.')
        setLastError(err)
        writeCallbacks?.onError?.(err)
        return
      }

      setCallbacks(writeCallbacks || null)
      setLastError(null)

      try {
        const finalConfig = {
          address: overrideConfig?.address || address,
          abi: overrideConfig?.abi || abi,
          functionName: overrideConfig?.functionName || functionName,
          args: overrideConfig?.args || args,
          chainId: overrideConfig?.chainId || chainId,
          value: overrideConfig?.value || value,
          gas: overrideConfig?.gas || gas,
        }

        // Retry logic for rate limit errors
        let lastError: Error | null = null
        const maxRetries = 3
        const retryDelays = [1000, 2000, 5000] // 1s, 2s, 5s

        // Try to simulate the transaction first to get the actual revert reason (non-blocking for Hardhat)
        // On Hardhat, simulation errors are often generic, so we'll try the actual transaction anyway
        if (publicClient && accountAddress) {
          try {
            console.log('[useContract] Simulating transaction to capture revert reason...')
            await publicClient.simulateContract({
              address: finalConfig.address,
              abi: finalConfig.abi as Abi,
              functionName: finalConfig.functionName as string,
              args: finalConfig.args,
              account: accountAddress,
              value: finalConfig.value,
            })
            console.log('[useContract] ✅ Transaction simulation successful - transaction should work')
          } catch (simErr: any) {
            // Simulation failed - log it but don't block the transaction
            // Hardhat often gives generic errors in simulation, so let the actual transaction try
            const simError = simErr as Error
            console.warn('[useContract] ⚠️ Transaction simulation failed (will still attempt transaction):', simError)
            
            // Only block if it's a clear, specific error (not Hardhat's generic "Internal JSON-RPC error")
            const simMessage = simError.message || ''
            const isGenericHardhatError = simMessage.includes('Internal JSON-RPC error') || 
                                         simMessage.includes('returned no data') ||
                                         simMessage.includes('does not have the function')
            
            // If it's a generic Hardhat error, continue with the transaction
            // The actual transaction will show the real error from Hardhat node terminal
            if (!isGenericHardhatError) {
              // Only block for specific, clear errors
              let revertReason = 'Unknown error'
              
              if (simMessage.includes('Token not whitelisted')) {
                revertReason = 'Token not whitelisted'
              } else if (simMessage.includes('Deposit amount must be greater than 0')) {
                revertReason = 'Deposit amount must be greater than 0'
              } else if (simMessage.includes('Insufficient balance')) {
                revertReason = 'Insufficient balance'
              } else {
                // For other errors, still allow transaction to proceed (Hardhat might give better error)
                console.log('[useContract] Allowing transaction to proceed despite simulation error')
              }
              
              // Only block if we have a specific, actionable error
              if (revertReason !== 'Unknown error') {
                const friendlyError = new Error(
                  `Transaction would fail: ${revertReason}\n\n` +
                  'This error was caught during simulation.'
                )
                setLastError(friendlyError)
                writeCallbacks?.onError?.(friendlyError)
                return
              }
            }
            
            // For generic errors, continue and let the actual transaction try
            console.log('[useContract] Continuing with transaction despite simulation warning')
          }
        }

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const txHash = await writeContractAsync(finalConfig)
            
            if (txHash) {
              writeCallbacks?.onSuccess?.(txHash)
              return // Success, exit retry loop
            }
          } catch (retryErr) {
            lastError = retryErr as Error
            const isRateLimit = lastError.message.includes('rate limit') || 
                               lastError.message.includes('exceeds defined limit') ||
                               lastError.message.includes('LimitExceeded')

            // If it's a rate limit error and we have retries left, wait and retry
            if (isRateLimit && attempt < maxRetries) {
              const delay = retryDelays[attempt] || 5000
              console.log(`Rate limit detected, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`)
              await new Promise(resolve => setTimeout(resolve, delay))
              continue // Retry
            }

            // If not a rate limit error, or no retries left, throw
            throw lastError
          }
        }

        // If we exhausted retries, throw the last error
        if (lastError) {
          throw lastError
        }
      } catch (err) {
        const error = err as Error
        setLastError(error)
        
        // Log full error details for debugging (especially for Hardhat)
        const errorObj = err as any
        
        // Helper to safely serialize error objects (handles BigInt)
        const safeSerialize = (obj: any): any => {
          if (obj === null || obj === undefined) return obj
          if (typeof obj === 'bigint') return obj.toString() + 'n'
          if (typeof obj !== 'object') return obj
          if (Array.isArray(obj)) return obj.map(safeSerialize)
          
          const result: any = {}
          for (const key in obj) {
            try {
              const value = obj[key]
              if (typeof value === 'bigint') {
                result[key] = value.toString() + 'n'
              } else if (value && typeof value === 'object') {
                try {
                  result[key] = safeSerialize(value)
                } catch {
                  result[key] = '[Object]'
                }
              } else {
                result[key] = value
              }
            } catch {
              result[key] = '[Error accessing property]'
            }
          }
          return result
        }
        
        console.error('[useContract] Full error details:', safeSerialize({
          message: error.message,
          name: error.name,
          stack: error.stack,
          cause: errorObj?.cause,
          data: errorObj?.data,
          shortMessage: errorObj?.shortMessage,
          details: errorObj?.details,
          causeCause: errorObj?.cause?.cause,
          causeData: errorObj?.cause?.data,
          causeShortMessage: errorObj?.cause?.shortMessage,
          causeReason: errorObj?.cause?.reason,
        }))
        
        // Log contract call details if available
        if (errorObj?.data?.request) {
          console.error('[useContract] Contract call that failed:', safeSerialize({
            address: errorObj.data.request?.to,
            function: errorObj.data.request?.data,
            args: errorObj.data.request?.args,
            value: errorObj.data.request?.value,
          }))
        }
        
        // Parse and enhance error messages to be user-friendly
        const friendlyError = parseContractError(error)
        writeCallbacks?.onError?.(friendlyError)
      }
    },
    [isConnected, accountAddress, abi, functionName, args, chainId, value, gas, writeContractAsync, publicClient]
  )

  // Async write function (returns hash)
  const writeAsync = useCallback(
    async (
      overrideConfig?: Partial<UseContractWriteConfig>,
      writeCallbacks?: ContractWriteCallbacks
    ): Promise<`0x${string}` | undefined> => {
      if (!isConnected) {
        const err = new Error('Wallet not connected. Please connect your wallet first.')
        setLastError(err)
        writeCallbacks?.onError?.(err)
        throw err
      }

      setCallbacks(writeCallbacks || null)
      setLastError(null)

      try {
        const finalConfig = {
          address: overrideConfig?.address || address,
          abi: overrideConfig?.abi || abi,
          functionName: overrideConfig?.functionName || functionName,
          args: overrideConfig?.args || args,
          chainId: overrideConfig?.chainId || chainId,
          value: overrideConfig?.value || value,
          gas: overrideConfig?.gas || gas,
        }

        // Retry logic for rate limit errors
        let lastError: Error | null = null
        const maxRetries = 3
        const retryDelays = [1000, 2000, 5000] // 1s, 2s, 5s

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const txHash = await writeContractAsync(finalConfig)
            
            if (txHash) {
              writeCallbacks?.onSuccess?.(txHash)
              return txHash
            }
          } catch (retryErr) {
            lastError = retryErr as Error
            const isRateLimit = lastError.message.includes('rate limit') || 
                               lastError.message.includes('exceeds defined limit') ||
                               lastError.message.includes('LimitExceeded')

            // If it's a rate limit error and we have retries left, wait and retry
            if (isRateLimit && attempt < maxRetries) {
              const delay = retryDelays[attempt] || 5000
              console.log(`Rate limit detected, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`)
              await new Promise(resolve => setTimeout(resolve, delay))
              continue // Retry
            }

            // If not a rate limit error, or no retries left, throw
            throw lastError
          }
        }

        // If we exhausted retries, throw the last error
        if (lastError) {
          throw lastError
        }
      } catch (err) {
        const error = err as Error
        setLastError(error)
        
        // Parse and enhance error messages to be user-friendly
        const friendlyError = parseContractError(error)
        writeCallbacks?.onError?.(friendlyError)
        throw friendlyError
      }
    },
    [isConnected, accountAddress, abi, functionName, args, chainId, value, gas, writeContractAsync, publicClient]
  )

  // Reset function
  const reset = useCallback(() => {
    resetWrite()
    setCallbacks(null)
    setLastError(null)
  }, [resetWrite])

  return {
    write,
    writeAsync,
    hash,
    receipt,
    isPending,
    isConfirming,
    isSuccess,
    isError: isReceiptError || !!writeError || !!lastError,
    error: lastError || (writeError as Error) || (receiptError as Error) || null,
    reset,
  }
}

// ============================================
// CONVENIENCE HOOKS
// ============================================

/**
 * Simplified hook for contract reads with automatic refetching
 * Useful for displaying real-time data
 */
export function useContractReadAuto<T = any>(
  config: UseContractReadConfig & { refetchInterval?: number }
): UseContractReadReturn<T> {
  const { refetchInterval, ...readConfig } = config

  const {
    data,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    isEnabled,
  } = useContractRead<T>(readConfig)

  // Auto-refetch if interval is provided
  useEffect(() => {
    if (refetchInterval && isEnabled) {
      const interval = setInterval(() => {
        refetch()
      }, refetchInterval)

      return () => clearInterval(interval)
    }
  }, [refetchInterval, isEnabled, refetch])

  return {
    data,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    isEnabled,
  }
}

