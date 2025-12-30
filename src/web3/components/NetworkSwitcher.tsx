import { useNetworks, useAppKitWallet } from '@/web3/hooks/useAppKit'
import Button from '@/components/ui/Button'
import { ChevronDown } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'

export function NetworkSwitcher() {
  const { networks, currentNetwork } = useNetworks()
  const { switchNetwork, isConnected } = useAppKitWallet()

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      await switchNetwork(chainId)
    } catch (error) {
      console.error('切换网络失败:', error)
      // 这里可以添加错误提示
    }
  }

  if (!isConnected || !currentNetwork) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
        >
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: currentNetwork.color }}
          />
          <span className="hidden sm:inline text-sm">{currentNetwork.name}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
        {networks.map((network) => (
          <DropdownMenuItem
            key={network.id}
            onClick={() => handleNetworkSwitch(network.id)}
            className={`flex items-center gap-3 text-sm ${
              network.isCurrent 
                ? 'text-cyan-400 bg-gray-800' 
                : 'text-gray-300 hover:bg-gray-800 focus:bg-gray-800'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: network.color }}
            />
            <div className="flex flex-col">
              <span className="font-medium">{network.name}</span>
              <span className="text-xs text-gray-400">{network.symbol}</span>
            </div>
            {network.isCurrent && (
              <span className="ml-auto text-xs text-cyan-400">当前</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}