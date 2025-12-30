import { useEffect, useRef } from 'react'
import { useAppKitWallet } from '@/web3/hooks/useAppKit'
import { Copy, LogOut, ExternalLink, AlertTriangle, ChevronDown, Cpu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { bscMainnet, bscTestnetConfig, hardhatLocal } from '@/web3/config/chains'
import { apiClient } from '@/services/apiClient'
import { useUserProfile } from '@/hooks/useApi'
import { logger } from '@/utils/logger'
import { useTranslation } from '@/i18n'
import { useAlert } from '@/components/ui/Alert'

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV

// Get explorer URL based on testnet detection
const getExplorerUrl = (isTestnet: boolean, address: string) => {
  if (isTestnet) {
    return `https://testnet.bscscan.com/address/${address}`
  }
  return `https://bscscan.com/address/${address}`
}


interface ConnectWalletButtonProps {
  onNavigateToInvitation?: () => void;
}

// User profile type - supports both snake_case and camelCase field names
interface UserProfile {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown; // Allow additional fields
}

export function ConnectWalletButton({ onNavigateToInvitation }: ConnectWalletButtonProps = {}) {
  const { t } = useTranslation();
  const {
    isConnected,
    address,
    chainId,
    chainName,
    balance,
    symbol,
    connect,
    disconnect,
    switchNetwork,
    switchToHardhat,
    isConnecting,
  } = useAppKitWallet()
  const { showAlert } = useAlert()

  // Fetch user profile when authenticated
  const isAuthenticated = () => {
    return !!apiClient.getAuthToken();
  }
  
  const { data: userProfile, isUsingMock, loading: profileLoading, error: profileError } = useUserProfile();

  // Check if connected to allowed network
  // In production: only mainnet allowed. Detect testnet by chainId OR symbol
  const isOnTestnet = chainId === bscTestnetConfig.id || symbol === 'tBNB'
  const isOnAllowedNetwork = isDevelopment 
    ? true  // In dev, all networks allowed
    : !isOnTestnet  // In production, testnet is NOT allowed
  
  // Get display name from profile (first_name + last_name) or fallback to wallet address
  const getDisplayName = () => {
    // Check if profile has first_name and last_name fields (supports both snake_case and camelCase)
    const profile = userProfile as UserProfile | null;
    const firstName = profile?.first_name || profile?.firstName || '';
    const lastName = profile?.last_name || profile?.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    // Fallback to formatted wallet address if profile data not available
    return address ? formatAddress(address) : '';
  }
  
  // Get first letter of last name for profile icon, or fallback to network indicator
  const getProfileInitial = () => {
    const profile = userProfile as UserProfile | null;
    const lastName = profile?.last_name || profile?.lastName || '';
    
    if (lastName) {
      const initial = lastName.charAt(0).toUpperCase();
      return initial || (isOnTestnet ? 'tBNB' : 'BNB');
    }
    // Fallback to network indicator
    return isOnTestnet ? 'tBNB' : 'BNB';
  }
  
  // Debug: Log profile data to see structure (only in development)
  useEffect(() => {
    if (userProfile) {
      const profile = userProfile as UserProfile;
      logger.log('[ConnectWalletButton] User profile data:', profile);
      logger.log('[ConnectWalletButton] First name (snake_case):', profile.first_name);
      logger.log('[ConnectWalletButton] Last name (snake_case):', profile.last_name);
      logger.log('[ConnectWalletButton] First name (camelCase):', profile.firstName);
      logger.log('[ConnectWalletButton] Last name (camelCase):', profile.lastName);
      logger.log('[ConnectWalletButton] Display name:', getDisplayName());
      logger.log('[ConnectWalletButton] Profile initial:', getProfileInitial());
      logger.log('[ConnectWalletButton] Is authenticated:', isAuthenticated());
      logger.log('[ConnectWalletButton] Profile ID:', profile.id, '(mock data has "user_001", real data has numeric ID)');
      logger.log('[ConnectWalletButton] Is using mock data:', isUsingMock);
      logger.log('[ConnectWalletButton] Profile loading:', profileLoading);
      if (profileError) {
        logger.error('[ConnectWalletButton] Profile error:', profileError);
      }
    }
  }, [userProfile, isDevelopment, isUsingMock, profileLoading, profileError]);

  // Track if we've already prompted for network switch (to avoid repeated prompts)
  const hasPromptedRef = useRef(false)

  // Auto-prompt to switch network when wrong network detected (production only)
  useEffect(() => {
    const autoSwitchNetwork = async () => {
      // Only auto-prompt in production mode when:
      // 1. User is connected
      // 2. On wrong network
      // 3. Haven't already prompted this session
      if (isConnected && !isOnAllowedNetwork && !hasPromptedRef.current) {
        hasPromptedRef.current = true
        logger.log('Wrong network detected! Auto-prompting to switch to BNB Mainnet...')
        
        try {
          await switchNetwork(bscMainnet.id)
        } catch (error) {
          logger.error('User rejected network switch or error occurred:', error)
          // Reset the flag after a delay so user can be prompted again if they reconnect
          setTimeout(() => {
            hasPromptedRef.current = false
          }, 5000)
        }
      }
    }

    autoSwitchNetwork()
  }, [isConnected, isOnAllowedNetwork, switchNetwork])

  // Reset the prompt flag when user disconnects
  useEffect(() => {
    if (!isConnected) {
      hasPromptedRef.current = false
    }
  }, [isConnected])

  // Reset PWA prompt when wallet connects (reconnect scenario)
  // Must be before any early returns to follow Rules of Hooks
  useEffect(() => {
    // When wallet connects and user is authenticated, reset PWA prompt
    if (isAuthenticated() && isConnected && address) {
      localStorage.removeItem('pwa-install-prompt-dismissed');
    }
  }, [isConnected, address]);

  // Custom disconnect handler that clears tokens and redirects
  const handleDisconnect = async () => {
    try {
      // Clear all authentication tokens
      apiClient.clearAuthTokens();
      
      // Set flag to prevent auto-reconnect (stored in sessionStorage so it persists during session)
      sessionStorage.setItem('user_disconnected', 'true');
      
      // Reset PWA install prompt dismissal so it can show again after reconnect/login
      localStorage.removeItem('pwa-install-prompt-dismissed');
      
      // Disconnect wallet
      await disconnect();
      
      // Navigate to invitation page (login)
      onNavigateToInvitation?.();
      
      logger.log('Wallet disconnected, tokens cleared, PWA prompt reset, redirected to login');
    } catch (error) {
      logger.error('Failed to disconnect wallet:', error);
      // Even if disconnect fails, clear tokens and redirect
      apiClient.clearAuthTokens();
      sessionStorage.setItem('user_disconnected', 'true');
      // Reset PWA install prompt dismissal
      localStorage.removeItem('pwa-install-prompt-dismissed');
      onNavigateToInvitation?.();
    }
  }

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        logger.log('Address copied to clipboard')
        showAlert({ type: 'success', message: t('wallet.copied') })
      } catch (err) {
        logger.error('Failed to copy address:', err)
        showAlert({ type: 'error', message: t('errors.failedCopyClipboard') })
      }
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Handle switch to mainnet (default for production)
  const handleSwitchToMainnet = async () => {
    try {
      await switchNetwork(bscMainnet.id)
    } catch (error) {
      logger.error('Failed to switch network:', error)
    }
  }

  // Handle switch to testnet (only in development)
  const handleSwitchToTestnet = async () => {
    if (isDevelopment) {
      try {
        await switchNetwork(bscTestnetConfig.id)
      } catch (error) {
        logger.error('Failed to switch network:', error)
      }
    }
  }

  // Handle switch to Hardhat local network (only in development)
  const handleSwitchToHardhat = async () => {
    console.log('[ConnectWalletButton] handleSwitchToHardhat called')
    console.log('[ConnectWalletButton] Current state:', {
      isDevelopment,
      hasSwitchToHardhat: !!switchToHardhat,
      currentChainId: chainId,
      targetHardhatChainId: hardhatLocal.id,
      isOnHardhat: chainId === hardhatLocal.id,
    })
    
    if (isDevelopment && switchToHardhat) {
      try {
        console.log('[ConnectWalletButton] Calling switchToHardhat function...')
        await switchToHardhat()
        console.log('[ConnectWalletButton] ✅ switchToHardhat completed successfully')
        logger.log('Successfully switched to Hardhat local network')
        
        // Wait a moment and verify the chain ID changed
        setTimeout(() => {
          console.log('[ConnectWalletButton] ⚠️ Post-switch verification:', {
            currentChainId: chainId,
            expectedChainId: hardhatLocal.id,
            isOnHardhat: chainId === hardhatLocal.id,
          })
        }, 1500)
      } catch (error: unknown) {
        const errorObj = error instanceof Error ? error : { message: String(error) }
        const errorWithCode = error as { code?: number | string; message?: string }
        console.error('[ConnectWalletButton] ❌ Error in handleSwitchToHardhat:', {
          code: errorWithCode.code,
          message: errorWithCode.message || errorObj.message,
          error: error,
        })
        logger.error('Failed to switch to Hardhat network:', error)
        // Show user-friendly error message
        if (errorWithCode.message || errorObj.message) {
          alert(errorWithCode.message || errorObj.message)
        } else {
          alert('Failed to switch to Hardhat network. Please make sure your Hardhat node is running on http://127.0.0.1:8545')
        }
      }
    } else {
      console.warn('[ConnectWalletButton] ⚠️ Cannot switch to Hardhat:', {
        isDevelopment,
        hasSwitchToHardhat: !!switchToHardhat,
      })
    }
  }

  // Check if currently on Hardhat network
  const isOnHardhat = chainId === hardhatLocal.id
  
  // Debug logging for chain ID changes
  useEffect(() => {
    console.log('[ConnectWalletButton] Chain ID changed:', {
      chainId,
      hardhatLocalId: hardhatLocal.id,
      isOnHardhat: chainId === hardhatLocal.id,
      chainName,
      symbol,
    })
  }, [chainId, chainName, symbol])

  // Connected but wrong network - show switch network prompt
  if (isConnected && address && !isOnAllowedNetwork) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 border-2 border-red-400 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors shadow-sm"
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="font-['Figtree:Bold',sans-serif] font-bold text-xs text-red-600 whitespace-nowrap">
              Wrong Network
            </span>
            <ChevronDown className="w-3 h-3 text-red-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border border-gray-200 rounded-xl shadow-xl min-w-[240px] p-0 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-red-50 border-b border-red-100">
            <div className="text-sm font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Unsupported Network
            </div>
            <div className="text-xs text-red-500 mt-1">
              Current: {chainName || 'Unknown'}
            </div>
          </div>
          
          {/* Switch Options */}
          <div className="p-2">
            <DropdownMenuItem 
              onClick={handleSwitchToMainnet}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#F3BA2F] flex items-center justify-center">
                <span className="text-white font-bold text-xs">BNB</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">BNB Smart Chain</div>
                <div className="text-xs text-gray-500">Mainnet</div>
              </div>
            </DropdownMenuItem>
            
            {/* Only show testnet option in development */}
            {isDevelopment && (
              <DropdownMenuItem 
                onClick={handleSwitchToTestnet}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-purple-50 focus:bg-purple-50 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">tBNB</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">BNB Testnet</div>
                  <div className="text-xs text-gray-500">Development only</div>
                </div>
              </DropdownMenuItem>
            )}
          </div>
          
          <DropdownMenuSeparator className="bg-gray-100 m-0" />
          
          <div className="p-2">
            <DropdownMenuItem 
              onClick={handleDisconnect}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-sm">Disconnect</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Connected state - show wallet address with dropdown
  if (isConnected && address) {
    // Use the already-calculated isOnTestnet for consistency
    const displayName = getDisplayName();
    const profileInitial = getProfileInitial();
    const profile = userProfile as UserProfile | null;
    const isUsingProfileName = profile && (profile.first_name || profile.firstName) && (profile.last_name || profile.lastName);
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 border border-gray-300 bg-white px-3 py-1.5 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
          >
            <div className={`w-2 h-2 rounded-full ${isOnTestnet ? 'bg-purple-500' : 'bg-green-500'}`} />
            <span className="font-['Figtree:Bold',sans-serif] font-bold text-xs text-gray-700 whitespace-nowrap">
              {displayName}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border border-gray-200 rounded-xl shadow-xl min-w-[260px] p-0 overflow-hidden">
          {/* Wallet Info Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOnTestnet ? 'bg-purple-100' : 'bg-amber-100'}`}>
                <span className={`font-bold text-sm ${isOnTestnet ? 'text-purple-600' : 'text-amber-600'}`}>
                  {isUsingProfileName ? profileInitial : (isOnTestnet ? 'tBNB' : 'BNB')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm truncate">
                  {displayName}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isOnTestnet ? 'bg-purple-500' : 'bg-green-500'}`} />
                  <span className="text-xs text-gray-500">
                    {chainName || (isOnTestnet ? 'BNB Testnet' : 'BNB Chain')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Balance */}
            {balance && (
              <div className="mt-3 px-3 py-2 bg-white rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500">{t('common.balance')}</div>
                <div className="font-semibold text-gray-800">
                  {parseFloat(balance).toFixed(4)} <span className="text-gray-500">{symbol}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="p-2">
            <DropdownMenuItem 
              onClick={copyAddress}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
            >
              <Copy className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-sm">{t('wallet.copyAddress')}</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => window.open(getExplorerUrl(isOnTestnet, address), '_blank')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-sm">{isOnTestnet ? t('wallet.viewOnTestnet') : t('wallet.viewOnBscScan')}</span>
            </DropdownMenuItem>
            
            {/* Network switch options in development */}
            {isDevelopment && (
              <>
                <DropdownMenuSeparator className="bg-gray-100 my-1" />
                
                {/* Switch between Mainnet and Testnet - Show when not on Hardhat */}
                {!isOnHardhat && (
                  <DropdownMenuItem 
                    onClick={isOnTestnet ? handleSwitchToMainnet : handleSwitchToTestnet}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
                  >
                    <div className={`w-4 h-4 rounded-full ${isOnTestnet ? 'bg-amber-400' : 'bg-purple-500'}`} />
                    <span className="font-medium text-sm">
                      {isOnTestnet ? t('wallet.switchToMainnet') : t('wallet.switchToTestnet')}
                    </span>
                  </DropdownMenuItem>
                )}
                
                {/* Switch options when on Hardhat - allow switching back to Mainnet or Testnet */}
                {isOnHardhat && (
                  <>
                    <DropdownMenuItem 
                      onClick={handleSwitchToMainnet}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-amber-50 focus:bg-amber-50 cursor-pointer"
                    >
                      <div className="w-4 h-4 rounded-full bg-amber-400" />
                      <span className="font-medium text-sm">
                        {t('wallet.switchToMainnet')}
                      </span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={handleSwitchToTestnet}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-purple-50 focus:bg-purple-50 cursor-pointer"
                    >
                      <div className="w-4 h-4 rounded-full bg-purple-500" />
                      <span className="font-medium text-sm">
                        {t('wallet.switchToTestnet')}
                      </span>
                    </DropdownMenuItem>
                  </>
                )}
                
                {/* Switch to Hardhat Local Network - only show when not already on it */}
                {!isOnHardhat && (
                  <DropdownMenuItem 
                    onClick={handleSwitchToHardhat}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 focus:bg-blue-50 cursor-pointer"
                  >
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="font-medium text-sm">
                      切换到本地 Hardhat 节点
                    </span>
                  </DropdownMenuItem>
                )}
                
                {/* Current network indicator for Hardhat */}
                {isOnHardhat && (
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="font-medium text-sm">
                      已连接本地 Hardhat 节点
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          
          <DropdownMenuSeparator className="bg-gray-100 m-0" />
          
          <div className="p-2">
            <DropdownMenuItem 
              onClick={handleDisconnect}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-sm">{t('wallet.disconnect')}</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Not connected - show connect button matching original Header style
  const handleConnectClick = () => {
    // If user is not authenticated, navigate to InvitationPage
    // Otherwise, proceed with normal wallet connection
    if (!isAuthenticated() && onNavigateToInvitation) {
      onNavigateToInvitation();
    } else {
      connect();
    }
  };

  return (
    <button
      type="button"
      onClick={handleConnectClick}
      disabled={isConnecting}
      className="inline-flex items-center gap-2 border border-black px-3 py-2 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      <Cpu className="h-4 w-4 text-cyan-400" />
      <span className="font-['Figtree:Bold',sans-serif] font-bold text-xs text-black whitespace-nowrap">
        {isConnecting ? t('common.connecting') : t('common.connectWallet')}
      </span>
    </button>
  )
}
