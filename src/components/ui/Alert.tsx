// Simple Alert component for ConnectWalletButton
import { createContext, useContext, useState, type ReactNode } from 'react'

interface AlertContextValue {
  showAlert: (alert: { type: 'success' | 'error' | 'warning' | 'info'; message: string }) => void
}

const AlertContext = createContext<AlertContextValue | null>(null)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Array<{ id: number; type: string; message: string }>>([])

  const showAlert = ({ type, message }: { type: string; message: string }) => {
    const id = Date.now()
    setAlerts((prev) => [...prev, { id, type, message }])
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    }, 3000)
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`px-4 py-2 rounded-lg shadow-lg ${
              alert.type === 'success'
                ? 'bg-green-500 text-white'
                : alert.type === 'error'
                ? 'bg-red-500 text-white'
                : alert.type === 'warning'
                ? 'bg-yellow-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    // Return a no-op function if not inside AlertProvider
    return { showAlert: () => {} }
  }
  return context
}

