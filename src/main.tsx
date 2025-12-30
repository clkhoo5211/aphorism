import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// Import web3 config to initialize AppKit - must be imported before use
import './web3/config/appkit'
import { Web3Provider } from './web3/AppProvider'
import { AlertProvider } from './components/ui/Alert'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Provider>
      <AlertProvider>
        <BrowserRouter basename="/aphorism">
          <App />
        </BrowserRouter>
      </AlertProvider>
    </Web3Provider>
  </StrictMode>,
)
