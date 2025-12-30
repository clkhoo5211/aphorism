import { useState, useCallback } from 'react'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { useAccount } from './useAccount'
import { parseEther, formatEther } from 'viem'

// 类型定义
export interface SendTransactionParams {
  to: `0x${string}`
  value?: string
  data?: `0x${string}`
  gasLimit?: string
  gasPrice?: string
}

export type TransactionState = 'idle' | 'pending' | 'confirmed' | 'failed'

export interface GasEstimate {
  gasLimit: string
  gasPrice: string
  totalCost: string
}

export interface UseTransactionReturn {
  sendTransaction: (
    params: SendTransactionParams,
    callbacks?: {
      onSuccess?: (hash: string) => void
      onError?: (error: Error) => void
      onConfirmed?: (receipt: any) => void
    }
  ) => Promise<void>
  state: TransactionState
  isLoading: boolean
  hash: string | null
  receipt: any | null
  error: Error | null
  estimateGas: (params: SendTransactionParams) => Promise<GasEstimate | null>
  gasEstimate: GasEstimate | null
  reset: () => void
}

export function useTransaction(): UseTransactionReturn {
  const { address, isConnected } = useAccount()
  const [state, setState] = useState<TransactionState>('idle')
  const [hash, setHash] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<any | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null)

  const { sendTransactionAsync, isPending: isSending } = useSendTransaction()
  
  // 等待交易确认
  const { data: txReceipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}` | undefined,
    query: {
      enabled: !!hash,
    },
  })

  // 处理交易确认
  if (txReceipt && state === 'pending') {
    setState('confirmed')
    setReceipt(txReceipt)
  }

  const isLoading = isSending || isConfirming || state === 'pending'

  // 估算 Gas
  const estimateGas = useCallback(async (params: SendTransactionParams): Promise<GasEstimate | null> => {
    if (!isConnected || !address) {
      return null
    }

    try {
      // 简化的 gas 估算
      const gasLimit = params.gasLimit || '21000'
      const gasPrice = params.gasPrice || '5000000000' // 5 Gwei
      
      const totalCostWei = BigInt(gasLimit) * BigInt(gasPrice)
      const totalCost = formatEther(totalCostWei)

      const estimate: GasEstimate = {
        gasLimit,
        gasPrice,
        totalCost,
      }

      setGasEstimate(estimate)
      return estimate
    } catch (err) {
      console.error('Gas estimation failed:', err)
      return null
    }
  }, [isConnected, address])

  // 发送交易
  const sendTransaction = useCallback(async (
    params: SendTransactionParams,
    callbacks?: {
      onSuccess?: (hash: string) => void
      onError?: (error: Error) => void
      onConfirmed?: (receipt: any) => void
    }
  ) => {
    if (!isConnected || !address) {
      const err = new Error('请先连接钱包')
      setError(err)
      callbacks?.onError?.(err)
      return
    }

    try {
      setState('pending')
      setError(null)
      setHash(null)
      setReceipt(null)

      const txHash = await sendTransactionAsync({
        to: params.to,
        value: params.value ? parseEther(params.value) : undefined,
        data: params.data,
      })

      setHash(txHash)
      callbacks?.onSuccess?.(txHash)

      // 注意：交易确认会在 useWaitForTransactionReceipt 中处理
      // 当 txReceipt 更新时，state 会变为 'confirmed'
      
    } catch (err) {
      const error = err as Error
      setState('failed')
      setError(error)
      callbacks?.onError?.(error)
      console.error('Transaction failed:', error)
    }
  }, [isConnected, address, sendTransactionAsync])

  // 重置状态
  const reset = useCallback(() => {
    setState('idle')
    setHash(null)
    setReceipt(null)
    setError(null)
    setGasEstimate(null)
  }, [])

  return {
    sendTransaction,
    state,
    isLoading,
    hash,
    receipt,
    error,
    estimateGas,
    gasEstimate,
    reset,
  }
}

