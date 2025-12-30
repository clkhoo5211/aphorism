import React, { useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { web3Config } from '@/web3/config/appkit'
import { logger } from '@/utils/logger'

// Web3 提供者组件
export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Suppress SIWX errors since we're not using Sign-In with X
  // We're using wallet-based authentication (wallet address + password)
  useEffect(() => {
    // Suppress "Invalid App Configuration" UI alert from Reown AppKit
    // This error (APKT002) can persist even after domain is whitelisted due to API cache/propagation
    // Monitor DOM for the alert and hide it when it appears
    const hideInvalidConfigAlert = () => {
      // Find the alert element by its text content
      const alerts = document.querySelectorAll('[class*="alert"], [class*="error"], [class*="w3m"]');
      alerts.forEach((alert) => {
        const text = alert.textContent || '';
        if (text.includes('Invalid App Configuration') || text.includes('APKT002')) {
          // Hide the alert element
          (alert as HTMLElement).style.display = 'none';
          // Also try to remove it
          alert.remove();
        }
      });
    };
    
    // Use MutationObserver to watch for alert elements being added to DOM
    const observer = new MutationObserver(hideInvalidConfigAlert);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // Also check periodically
    const interval = setInterval(hideInvalidConfigAlert, 500);

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress "No ActiveCaipAddress found" errors from SIWX
      if (
        event.reason?.message?.includes('No ActiveCaipAddress found') ||
        event.reason?.message?.includes('ActiveCaipAddress') ||
        (event.reason?.stack && event.reason.stack.includes('SIWXUtil'))
      ) {
        logger.warn('[SIWX] Suppressed SIWX error (not using Sign-In with X):', event.reason?.message);
        event.preventDefault();
      }
      
      // Suppress APKT002 errors - they're just warnings
      if (
        event.reason?.code === 'APKT002' ||
        (event.reason?.message && event.reason.message.includes('not in your allow list')) ||
        (event.reason?.message && event.reason.message.includes('Invalid App Configuration'))
      ) {
        event.preventDefault();
      }
      
      
      // Log wallet connection errors for debugging (especially Binance Wallet)
      if (
        event.reason?.message?.includes('connection') ||
        event.reason?.message?.includes('declined') ||
        event.reason?.message?.includes('rejected') ||
        event.reason?.message?.includes('wallet') ||
        event.reason?.code === 'USER_REJECTED' ||
        event.reason?.code === 4001
      ) {
        logger.error('[Wallet Connection] Error detected:', {
          code: event.reason?.code,
          message: event.reason?.message,
          name: event.reason?.name,
          stack: event.reason?.stack,
          reason: event.reason,
        });
        // Don't prevent default - let the error propagate so it can be handled
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Cleanup function
    return () => {
      observer.disconnect();
      clearInterval(interval);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <WagmiProvider config={web3Config.wagmiConfig}>
      <QueryClientProvider client={web3Config.queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}