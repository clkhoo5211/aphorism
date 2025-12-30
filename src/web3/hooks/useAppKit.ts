import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitState } from '@reown/appkit/react'
import { useAccount } from './useAccount'
import { useBalance } from './useBalance'
import { useChainId } from './useChainId'
import { useState, useEffect } from 'react'
import { supportedChains, chainMetadata, hardhatLocal } from '@/web3/config/chains'
import { formatUnits } from 'viem'

// 类型定义
export interface WalletInfo {
  isConnected: boolean
  address?: string
  chainId?: number
  chainName?: string
  balance?: string
  symbol?: string
  connector?: string
  isConnecting: boolean
}

export interface NetworkInfo {
  id: number
  name: string
  symbol: string
  color: string
  isCurrent: boolean
}

// 主要的钱包连接 hook
export function useAppKitWallet() {
  const { open, close } = useAppKit()
  const { isConnected, address } = useAppKitAccount()
  useAppKitState() // Track state for reactivity
  const { chainId: wagmiChainId, connector } = useAccount()
  const wagmiChainIdDirect = useChainId() // Direct chainId from wagmi as additional fallback
  
  // Use wagmi's chainId which is more reliable - prefer from useAccount, fallback to direct useChainId
  const currentChainId = wagmiChainId ?? wagmiChainIdDirect
  const currentChain = supportedChains.find(c => c.id === currentChainId)
  
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    chainId: currentChainId,
  })
  const [isConnecting, setIsConnecting] = useState(false)

  // 获取钱包连接器信息
  const { walletProvider } = useAppKitProvider('eip155')
  
  // Debug: Log chain ID changes in real-time
  useEffect(() => {
    if (isConnected) {
      console.log('[useAppKitWallet] ⚠️ Chain ID Changed/Updated:', {
        chainId: currentChainId,
        chainName: currentChain?.name,
        isHardhat: currentChainId === hardhatLocal.id,
        hardhatChainId: hardhatLocal.id,
        timestamp: new Date().toISOString(),
      })
      
      if (currentChainId === hardhatLocal.id) {
        console.log('[useAppKitWallet] ✅ CONFIRMED: Connected to Hardhat Local network!')
      } else if (currentChainId) {
        console.log('[useAppKitWallet] ℹ️ Currently connected to:', currentChain?.name || 'Unknown network')
      }
    }
  }, [currentChainId, isConnected, currentChain])
  
  // Listen for direct wallet provider chain changes (MetaMask events)
  useEffect(() => {
    if (!connector || !isConnected) return
    
    const setupProviderListener = async () => {
      try {
        const provider = await connector.getProvider() as any
        if (provider && provider.on) {
          console.log('[useAppKitWallet] Setting up wallet provider chain change listener...')
          
          const handleChainChanged = (chainIdHex: string) => {
            const chainId = parseInt(chainIdHex, 16)
            console.log('[useAppKitWallet] 🔔 Wallet provider chain changed event:', {
              chainIdHex,
              chainId,
              isHardhat: chainId === hardhatLocal.id,
              hardhatChainId: hardhatLocal.id,
              timestamp: new Date().toISOString(),
            })
            
            if (chainId === hardhatLocal.id) {
              console.log('[useAppKitWallet] ✅ Wallet provider confirmed: Connected to Hardhat Local!')
            }
          }
          
          provider.on('chainChanged', handleChainChanged)
          
          return () => {
            if (provider.removeListener) {
              provider.removeListener('chainChanged', handleChainChanged)
            } else if (provider.off) {
              provider.off('chainChanged', handleChainChanged)
            }
          }
        }
      } catch (error) {
        console.warn('[useAppKitWallet] Could not setup provider listener:', error)
      }
    }
    
    const cleanup = setupProviderListener()
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.())
    }
  }, [connector, isConnected])

  const walletInfo: WalletInfo = {
    isConnected,
    address: address || undefined,
    chainId: currentChainId,
    chainName: currentChain?.name,
    balance: balance ? formatUnits(balance.value, balance.decimals) : '0',
    symbol: balance?.symbol,
    connector: (walletProvider as any)?.name || 'Unknown',
    isConnecting,
  }

  const connect = async () => {
    try {
      setIsConnecting(true)
      console.log('[useAppKitWallet] Opening wallet connection modal...')
      await open()
    } catch (error: any) {
      console.error('[useAppKitWallet] ❌ Wallet connection failed:', {
        error,
        code: error?.code,
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
      })
      // Log specific error types
      if (error?.code === 4001 || error?.message?.toLowerCase().includes('user rejected')) {
        console.error('[useAppKitWallet] User rejected the connection request')
      } else if (error?.message?.toLowerCase().includes('declined')) {
        console.error('[useAppKitWallet] Connection was declined - this may indicate a wallet compatibility issue')
      }
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    try {
      // In wagmi v3, disconnect using the connector directly
      if (connector) {
        await connector.disconnect()
      }
      await close()
    } catch (error) {
      console.error('断开连接失败:', error)
      throw error
    }
  }

  const switchNetwork = async (chainId: number) => {
    try {
      // In wagmi v3, switch chain using the connector directly
      if (!connector) {
        throw new Error('No connector available')
      }
      await connector.switchChain({ id: chainId })
    } catch (error) {
      console.error('切换网络失败:', error)
      throw error
    }
  }

  // Helper function to query Hardhat node directly (not through MetaMask)
  const queryHardhatChainId = async (): Promise<number | null> => {
    try {
      const response = await fetch('http://127.0.0.1:8545', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1,
        }),
      })
      const data = await response.json()
      if (data.result) {
        return parseInt(data.result, 16)
      }
    } catch (error) {
      console.error('[switchToHardhat] Failed to query Hardhat node directly:', error)
    }
    return null
  }

  // Add and switch to Hardhat local network
  const switchToHardhat = async () => {
    console.log('[switchToHardhat] Starting Hardhat network switch process...')
    
    // First, query the actual Hardhat node to see what chain ID it's using
    const actualHardhatChainId = await queryHardhatChainId()
    const targetChainId = actualHardhatChainId || hardhatLocal.id
    
    console.log('[switchToHardhat] Hardhat node chain ID:', actualHardhatChainId)
    console.log('[switchToHardhat] Target chain ID:', targetChainId)
    console.log('[switchToHardhat] Current chain ID:', currentChainId)
    
    // If already on the target chain, we're done
    if (currentChainId === targetChainId) {
      console.log('[switchToHardhat] ✅ Already on Hardhat network!')
      return
    }
    
    try {
      // First try to switch to the chain (in case it's already added in MetaMask)
      console.log('[switchToHardhat] Attempting to switch to Hardhat network...')
      if (!connector) {
        throw new Error('No connector available')
      }
      try {
        await connector.switchChain({ id: targetChainId })
        console.log('[switchToHardhat] ✅ switchChain call completed')
        
        // Wait a moment for the switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verify the switch worked
        if (connector) {
          try {
            const provider = await connector.getProvider() as any
            if (provider && typeof provider.request === 'function') {
              const chainIdHex = await provider.request({ method: 'eth_chainId' })
              const newChainId = parseInt(chainIdHex, 16)
              console.log('[switchToHardhat] ✅ Verification - Current chain ID after switch:', newChainId)
              
              if (newChainId === targetChainId) {
                console.log('[switchToHardhat] ✅ CONFIRMED: Successfully switched to Hardhat network!')
                return
              }
            }
          } catch (err) {
            console.warn('[switchToHardhat] Could not verify chain ID:', err)
          }
        }
      } catch (switchError: any) {
        console.log('[switchToHardhat] Switch failed, error details:', {
          code: switchError?.code,
          name: switchError?.name,
          message: switchError?.message,
          error: switchError,
        })
        
        // If switch fails, it might be because the chain doesn't exist in the wallet
        // Error code 4902 means the chain is not added to the wallet
        const isChainNotAdded = switchError?.code === 4902 || 
                               switchError?.name === 'ChainNotFoundError' || 
                               switchError?.message?.includes('not been added') ||
                               switchError?.message?.includes('not found')
        
        console.log('[switchToHardhat] Is chain not added?', isChainNotAdded)
        
        if (isChainNotAdded) {
          console.log('[switchToHardhat] Chain not found in wallet, attempting to add it...')
          
          // Need to add the chain first using wallet provider directly
          if (!connector) {
            console.error('[switchToHardhat] ❌ No wallet connector found!')
            throw new Error('No wallet connector found. Please connect your wallet first.')
          }

          console.log('[switchToHardhat] Connector found:', connector.name || 'Unknown')
          
          // Get the provider from the connector
          const provider = await connector.getProvider() as any
          
          if (!provider || typeof provider.request !== 'function') {
            console.error('[switchToHardhat] ❌ Wallet provider not available!', {
              provider: provider,
              hasRequest: typeof provider?.request === 'function',
            })
            throw new Error('Wallet provider not available. Please make sure your wallet is connected.')
          }

          console.log('[switchToHardhat] ✅ Wallet provider obtained, preparing chain params...')

          // Query Hardhat node directly to get the actual chain ID it's using
          const actualHardhatChainId = await queryHardhatChainId()
          const chainIdToUse = actualHardhatChainId || hardhatLocal.id
          
          console.log('[switchToHardhat] Using chain ID:', chainIdToUse, '(from node:', actualHardhatChainId, ', config:', hardhatLocal.id, ')')
          
          // Prepare chain params for EIP-3085 wallet_addEthereumChain
          const chainParams = {
            chainId: `0x${chainIdToUse.toString(16)}`, // Convert to hex, use actual node chain ID
            chainName: hardhatLocal.name,
            nativeCurrency: {
              name: hardhatLocal.nativeCurrency.name,
              symbol: hardhatLocal.nativeCurrency.symbol,
              decimals: hardhatLocal.nativeCurrency.decimals,
            },
            rpcUrls: hardhatLocal.rpcUrls.default.http,
            blockExplorerUrls: hardhatLocal.blockExplorers?.default?.url 
              ? [hardhatLocal.blockExplorers.default.url] 
              : [],
          }

          console.log('[switchToHardhat] Chain params to add:', JSON.stringify(chainParams, null, 2))
          console.log('[switchToHardhat] Requesting wallet to add Hardhat network...')

          // Request to add the chain
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [chainParams],
            })
            console.log('[switchToHardhat] ✅ Successfully requested wallet to add Hardhat network')
            console.log('[switchToHardhat] Waiting 500ms for chain to be registered...')
          } catch (addError: any) {
            console.error('[switchToHardhat] ❌ Failed to add chain:', {
              code: addError?.code,
              message: addError?.message,
              error: addError,
            })
            
            // Check if error is because network already exists with same RPC but different chain ID
            const isDuplicateRpcError = addError?.code === -32603 || 
                                       addError?.message?.includes('same RPC endpoint') ||
                                       addError?.message?.includes('existing network')
            
            if (isDuplicateRpcError) {
              console.log('[switchToHardhat] ⚠️ Network already exists with same RPC URL')
              console.log('[switchToHardhat] MetaMask already has a Hardhat network configured. Attempting to switch to it...')
              
              // Query Hardhat node DIRECTLY (not through MetaMask) to get actual chain ID
              const actualHardhatChainId = await queryHardhatChainId()
              
              if (actualHardhatChainId) {
                console.log('[switchToHardhat] Hardhat node reports chain ID:', actualHardhatChainId)
                
                try {
                  // Try to switch to the actual chain ID that the node reports
                  await connector.switchChain({ id: actualHardhatChainId })
                  console.log('[switchToHardhat] ✅ Successfully switched to existing Hardhat network with chain ID', actualHardhatChainId)
                  return
                } catch (switchError: any) {
                  console.warn('[switchToHardhat] switchChain failed, trying wallet_switchEthereumChain...', switchError)
                  
                  // Fallback: use wallet_switchEthereumChain directly
                  try {
                    await provider.request({
                      method: 'wallet_switchEthereumChain',
                      params: [{ chainId: `0x${actualHardhatChainId.toString(16)}` }],
                    })
                    console.log('[switchToHardhat] ✅ Successfully switched using wallet_switchEthereumChain to chain ID', actualHardhatChainId)
                    return
                  } catch (finalError: any) {
                    console.error('[switchToHardhat] ❌ All switch methods failed:', finalError)
                    throw new Error(`Hardhat network exists but could not switch to it. Please switch to chain ID ${actualHardhatChainId} manually in MetaMask.`)
                  }
                }
              } else {
                throw new Error('Could not query Hardhat node. Please make sure it\'s running at http://127.0.0.1:8545')
              }
            } else {
              throw addError
            }
          }

          // Wait a bit for the chain to be added
          await new Promise(resolve => setTimeout(resolve, 500))

          console.log('[switchToHardhat] Now attempting to switch to the newly added Hardhat network...')

          // Then switch to it (use the chain ID we actually added)
          try {
            await connector.switchChain({ id: chainIdToUse })
            console.log('[switchToHardhat] ✅ Successfully switched to Hardhat network after adding!')
            console.log('[switchToHardhat] Note: Chain ID will be verified on next render/state update')
          } catch (finalSwitchError: any) {
            console.error('[switchToHardhat] ❌ Failed to switch after adding chain:', {
              code: finalSwitchError?.code,
              message: finalSwitchError?.message,
              error: finalSwitchError,
            })
            throw finalSwitchError
          }
        } else {
          console.error('[switchToHardhat] ❌ Switch failed for unknown reason:', switchError)
          throw switchError
        }
      }
    } catch (error: any) {
      console.error('[switchToHardhat] ❌ Failed to switch to Hardhat network:', {
        code: error?.code,
        name: error?.name,
        message: error?.message,
        error: error,
      })
      // Re-throw with a more user-friendly message
      if (error?.code === 4001 || error?.message?.includes('User rejected')) {
        throw new Error('User rejected adding/switching to Hardhat network')
      }
      throw error
    }
  }

  return {
    ...walletInfo,
    connect,
    disconnect: disconnectWallet,
    switchNetwork,
    switchToHardhat,
    openModal: open,
    closeModal: close,
  }
}

// 网络信息 hook
export function useNetworks() {
  const { chainId: accountChainId } = useAccount()
  const defaultChainId = useChainId() // Always call hooks unconditionally
  const currentChainId = accountChainId || defaultChainId

  const networks: NetworkInfo[] = supportedChains.map((chain) => {
    const metadata = chainMetadata[chain.id as keyof typeof chainMetadata]
    return {
      id: chain.id,
      name: chain.name,
      symbol: metadata.symbol,
      color: metadata.color,
      isCurrent: chain.id === currentChainId,
    }
  })

  return {
    networks,
    currentNetwork: networks.find(n => n.isCurrent),
  }
}

// 代币余额 hook
export function useTokenBalance(address?: `0x${string}`, tokenAddress?: `0x${string}`) {
  // Only fetch native balance if address is provided and no token address
  const { data: nativeBalance } = useBalance(
    address && !tokenAddress ? { address } : undefined
  )

  // Token balance not yet implemented - would require ERC20 contract calls
  const tokenBalance = undefined

  return {
    nativeBalance,
    tokenBalance,
    balance: tokenBalance || nativeBalance,
  }
}

// 格式化余额显示
export function formatBalance(balance: bigint | undefined, decimals: number = 18): string {
  if (!balance) return '0.00'
  const formatted = formatUnits(balance, decimals)
  const num = parseFloat(formatted)
  if (num === 0) return '0.00'
  if (num < 0.0001) return '< 0.0001'
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.min(6, Math.max(2, Math.ceil(-Math.log10(num)) + 2)),
  })
}

// 钱包状态监听 hook
export function useWalletEvents() {
  const [event, setEvent] = useState<string | null>(null)
  const { address } = useAppKitAccount()
  const { chainId } = useAccount()

  useEffect(() => {
    if (address) {
      setEvent('accountChanged')
    }
  }, [address])

  useEffect(() => {
    if (chainId) {
      setEvent('chainChanged')
    }
  }, [chainId])

  return { event, clearEvent: () => setEvent(null) }
}