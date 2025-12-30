// Simple i18n stub for web3 integration
export function useTranslation() {
  return {
    t: (key: string, defaultValue?: string) => {
      // Simple translation map for common keys
      const translations: Record<string, string> = {
        'wallet.copied': 'Address copied!',
        'errors.failedCopyClipboard': 'Failed to copy',
        'common.balance': 'Balance',
        'wallet.copyAddress': 'Copy Address',
        'wallet.viewOnTestnet': 'View on Testnet',
        'wallet.viewOnBscScan': 'View on BscScan',
        'wallet.switchToMainnet': 'Switch to Mainnet',
        'wallet.switchToTestnet': 'Switch to Testnet',
        'wallet.disconnect': 'Disconnect',
        'common.connecting': 'Connecting...',
        'common.connectWallet': 'Connect Wallet',
      }
      return translations[key] || defaultValue || key
    },
  }
}

