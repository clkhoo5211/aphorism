import { useAppKitWallet } from '@/web3/hooks/useAppKit'
import Card from '@/components/ui/Card'
import { Wallet, TrendingUp, Activity } from 'lucide-react'

export function BalanceDisplay() {
  const { isConnected, balance, symbol, address } = useAppKitWallet()

  if (!isConnected || !address) {
    return (
      <Card className="p-6 bg-gray-800/50 border-gray-700 text-center">
        <Wallet className="w-12 h-12 mx-auto text-gray-600 mb-3" />
        <p className="text-gray-400">请连接钱包查看余额</p>
      </Card>
    )
  }

  const balanceNum = parseFloat(balance || '0')
  const formattedBalance = balanceNum.toFixed(4)

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
      <div className="space-y-4">
        {/* 主余额显示 */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">钱包余额</p>
          <div className="text-3xl font-bold text-white mb-1">
            {formattedBalance}
          </div>
          <div className="text-lg text-gray-300">{symbol}</div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Wallet className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">钱包</p>
            <p className="text-sm font-medium text-white">已连接</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 rounded-lg bg-green-500/20 text-green-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">状态</p>
            <p className="text-sm font-medium text-white">活跃</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 rounded-lg bg-purple-500/20 text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-400">网络</p>
            <p className="text-sm font-medium text-white">BNB链</p>
          </div>
        </div>
      </div>
    </Card>
  )
}