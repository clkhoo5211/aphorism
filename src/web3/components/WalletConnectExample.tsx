import React, { useState } from 'react'
import { ConnectWalletButton } from '@/web3/components/ConnectWalletButton'
import { NetworkSwitcher } from '@/web3/components/NetworkSwitcher'
import { BalanceDisplay } from '@/web3/components/BalanceDisplay'
import { TransactionButton } from '@/web3/components/TransactionButton'
import { useWalletConnect, useBalance } from '@/web3/hooks'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowUpRight, QrCode, Download } from 'lucide-react'

export const WalletConnectExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'receive'>('overview')
  const { account, wallet, chain } = useWalletConnect()
  const { nativeBalance, tokenBalances, totalValue } = useBalance({ includeTokens: true })
  
  const [sendAmount, setSendAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')

  // 模拟代币数据
  const mockTokens = tokenBalances.length > 0 ? tokenBalances : [
    {
      token: {
        address: '0x55d398326f99059fF775485246999027B3197955' as `0x${string}`,
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 18,
      },
      balance: '1000000000000000000000000',
      formatted: '1000.000000',
      value: 1000,
      change: 0.1,
      icon: '/tokens/usdt.png',
    },
    {
      token: {
        address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82' as `0x${string}`,
        symbol: 'CAKE',
        name: 'PancakeSwap Token',
        decimals: 18,
      },
      balance: '500000000000000000000',
      formatted: '0.500000',
      value: 1.25,
      change: -2.3,
      icon: '/tokens/cake.png',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            NBN Web3 钱包集成演示
          </h1>
          <p className="text-gray-400 text-lg">
            支持多钱包连接，完整交易功能
          </p>
        </div>

        {/* 钱包连接区域 */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <ConnectWalletButton />
            {account.isConnected && (
              <NetworkSwitcher />
            )}
          </div>
          
          {account.isConnected && (
            <div className="text-sm text-gray-400">
              连接到 {wallet?.name} • {chain?.name}
            </div>
          )}
        </div>

        {account.isConnected ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧主要内容 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 余额显示 */}
              <BalanceDisplay />

              {/* 操作标签页 */}
              <Card className="p-0 overflow-hidden">
                <div className="border-b border-gray-800">
                  <div className="flex">
                    {[
                      { id: 'overview', label: '概览' },
                      { id: 'send', label: '发送' },
                      { id: 'receive', label: '接收' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {/* 概览标签页 */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          快速操作
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Button
                            variant="outline"
                            className="flex items-center justify-center space-x-2"
                            onClick={() => setActiveTab('send')}
                          >
                            <ArrowUpRight className="w-5 h-5" />
                            <span>发送代币</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center justify-center space-x-2"
                            onClick={() => setActiveTab('receive')}
                          >
                            <Download className="w-5 h-5" />
                            <span>接收代币</span>
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                          最近交易
                        </h3>
                        <div className="text-center py-8 text-gray-400">
                          暂无交易记录
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 发送标签页 */}
                  {activeTab === 'send' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          接收地址
                        </label>
                        <input
                          type="text"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          placeholder="0x..."
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          发送金额
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {nativeBalance?.symbol || 'ETH'}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSendAmount(nativeBalance?.formatted || '')}
                        >
                          最大
                        </Button>
                        <TransactionButton
                          to={recipientAddress}
                          value={sendAmount}
                          className="flex-1"
                          disabled={!recipientAddress || !sendAmount}
                        >
                          发送
                        </TransactionButton>
                      </div>
                    </div>
                  )}

                  {/* 接收标签页 */}
                  {activeTab === 'receive' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-64 h-64 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <QrCode className="w-16 h-16 text-gray-500" />
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-mono text-sm">
                              {account.address}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(account.address!)}
                            >
                              复制
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-4">
                          扫描二维码或复制地址来接收代币
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* 右侧信息面板 */}
            <div className="space-y-6">
              {/* 钱包信息 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  钱包信息
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={wallet?.icon} 
                      alt={wallet?.name}
                      className="w-10 h-10"
                    />
                    <div>
                      <div className="text-white font-medium">{wallet?.name}</div>
                      <div className="text-sm text-gray-400">已连接</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    地址: {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
                  </div>
                </div>
              </Card>

              {/* 网络状态 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  网络状态
                </h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    chain?.isSupported ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="text-white font-medium">{chain?.name}</div>
                    <div className="text-sm text-gray-400">
                      {chain?.isSupported ? '网络支持' : '网络不支持'}
                    </div>
                  </div>
                </div>
              </Card>

              {/* 资产分布 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  资产分布
                </h3>
                <div className="space-y-3">
                  {mockTokens.slice(0, 3).map((token, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                        <span className="text-sm text-white">{token.token.symbol}</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        ${token.value.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">总价值</span>
                    <span className="text-sm font-medium text-white">
                      ${totalValue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              连接钱包开始使用
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              连接您的 Web3 钱包以访问完整的 DeFi 功能。支持 MetaMask、Trust Wallet、TokenPocket 等主流钱包。
            </p>
            <ConnectWalletButton />
          </Card>
        )}
      </div>
    </div>
  )
}