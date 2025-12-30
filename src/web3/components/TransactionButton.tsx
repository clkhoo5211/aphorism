import React, { useState } from 'react'
import { useTransaction } from '@/web3/hooks/useTransaction'
import Button from '@/components/ui/Button'
import type { SendTransactionParams } from '@/web3/hooks/useTransaction'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export interface TransactionButtonProps {
  // 交易参数
  to: string
  value?: string
  data?: `0x${string}`
  gasLimit?: string
  gasPrice?: string
  
  // 按钮配置
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  
  // 文本配置
  loadingText?: string
  successText?: string
  errorText?: string
  
  // 回调函数
  onSuccess?: (hash: string) => void
  onError?: (error: Error) => void
  onConfirmed?: (receipt: any) => void
  
  // Gas 显示
  showGasEstimate?: boolean
  
  // 确认对话框
  requireConfirmation?: boolean
  confirmationTitle?: string
  confirmationMessage?: string
  
  className?: string
}

export const TransactionButton: React.FC<TransactionButtonProps> = ({
  to,
  value,
  data,
  gasLimit,
  gasPrice,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText = '处理中...',
  successText = '交易成功',
  errorText = '交易失败',
  onSuccess,
  onError,
  onConfirmed,
  showGasEstimate = false,
  requireConfirmation = true,
  confirmationTitle = '确认交易',
  confirmationMessage,
  className,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const {
    sendTransaction,
    state,
    isLoading,
    receipt,
    estimateGas,
    gasEstimate,
  } = useTransaction()

  // 构建交易参数
  const transactionParams: SendTransactionParams = {
    to: to as `0x${string}`,
    value,
    data,
    gasLimit,
    gasPrice,
  }

  // 估算 Gas 费用
  const handleEstimateGas = async () => {
    try {
      await estimateGas(transactionParams)
    } catch (error) {
      console.error('Gas estimation failed:', error)
    }
  }

  // 处理交易确认
  const handleConfirm = async () => {
    try {
      await sendTransaction(transactionParams, {
        onSuccess: (txHash) => {
          onSuccess?.(txHash)
          setShowConfirmation(false)
        },
        onError: (error) => {
          onError?.(error)
        },
        onConfirmed: (txReceipt) => {
          onConfirmed?.(txReceipt)
        },
      })
    } catch (error) {
      console.error('Transaction failed:', error)
      onError?.(error as Error)
    }
  }

  // 点击按钮处理
  const handleClick = () => {
    if (requireConfirmation) {
      setShowConfirmation(true)
      handleEstimateGas()
    } else {
      handleConfirm()
    }
  }

  // 获取按钮文本
  const getButtonText = () => {
    if (loading || isLoading) return loadingText
    if (state === 'confirmed') return successText
    if (state === 'failed') return errorText
    return children
  }

  // 获取按钮变体
  const getButtonVariant = () => {
    if (state === 'failed') return 'outline'
    if (state === 'confirmed') return 'secondary'
    return variant
  }

  return (
    <>
      <Button
        variant={getButtonVariant()}
        size={size}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={`${
          state === 'failed' 
            ? 'border-red-500 text-red-500 hover:bg-red-500/10' 
            : ''
        } ${className}`}
      >
        <div className="flex items-center space-x-2">
          {/* 状态图标 */}
          {isLoading && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          {state === 'confirmed' && (
            <CheckCircle className="w-4 h-4" />
          )}
          {state === 'failed' && (
            <AlertTriangle className="w-4 h-4" />
          )}
          {state === 'pending' && receipt === null && (
            <Clock className="w-4 h-4" />
          )}
          
          {/* 按钮文本 */}
          <span>{getButtonText()}</span>
        </div>
      </Button>

      {/* Gas 费用显示 */}
      {showGasEstimate && gasEstimate && (
        <div className="mt-2 p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">预估 Gas 费用</span>
            <span className="text-white">
              {gasEstimate.totalCost} ETH
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Gas Limit</span>
            <span className="text-white">
              {gasEstimate.gasLimit}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Gas Price</span>
            <span className="text-white">
              {gasEstimate.gasPrice} wei
            </span>
          </div>
        </div>
      )}

      {/* 确认对话框 */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        title={confirmationTitle}
        message={confirmationMessage}
        transactionParams={transactionParams}
        gasEstimate={gasEstimate}
        isLoading={isLoading}
      />
    </>
  )
}

// 确认对话框组件
interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message?: string
  transactionParams: SendTransactionParams
  gasEstimate: any
  isLoading: boolean
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  transactionParams,
  gasEstimate,
  isLoading,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 消息内容 */}
        {message && (
          <div className="mb-6 text-gray-300">
            {message}
          </div>
        )}

        {/* 交易详情 */}
        <div className="mb-6 space-y-4">
          {/* 目标地址 */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <span className="text-sm text-gray-400">发送至</span>
            <span className="text-sm text-white font-mono">
              {transactionParams.to.slice(0, 6)}...{transactionParams.to.slice(-4)}
            </span>
          </div>

          {/* 金额 */}
          {transactionParams.value && (
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-sm text-gray-400">金额</span>
              <span className="text-sm text-white font-medium">
                {transactionParams.value} ETH
              </span>
            </div>
          )}

          {/* Gas 费用 */}
          {gasEstimate && (
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-sm text-gray-400">Gas 费用</span>
              <span className="text-sm text-white">
                {gasEstimate.totalCost} ETH
              </span>
            </div>
          )}

          {/* 数据 */}
          {transactionParams.data && (
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">交易数据</div>
              <div className="text-xs text-white font-mono break-all">
                {transactionParams.data}
              </div>
            </div>
          )}
        </div>

        {/* 警告信息 */}
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-400 font-medium mb-1">
                交易确认
              </p>
              <p className="text-xs text-yellow-300">
                请仔细核对交易信息。交易一旦发送，将无法撤销。
              </p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            取消
          </Button>
          <Button
            className="flex-1"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>确认中...</span>
              </div>
            ) : (
              '确认交易'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}