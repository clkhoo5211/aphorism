// Type declaration for wagmi module
declare module 'wagmi' {
  import type { ReactNode } from 'react'
  import type { WagmiConfig } from '@wagmi/core'

  export interface WagmiProviderProps {
    config: WagmiConfig
    children: ReactNode
  }

  export function WagmiProvider(props: WagmiProviderProps): JSX.Element
}

