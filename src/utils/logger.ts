// Simple logger utility for web3 integration
const isDevelopment = import.meta.env.DEV

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[Logger]', ...args)
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[Logger]', ...args)
    }
  },
  warn: (...args: any[]) => {
    console.warn('[Logger]', ...args)
  },
  error: (...args: any[]) => {
    console.error('[Logger]', ...args)
  },
}

