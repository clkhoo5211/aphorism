// Simple DropdownMenu component for ConnectWalletButton
import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  const context = useContext(DropdownMenuContext)
  if (!context) throw new Error('DropdownMenuTrigger must be inside DropdownMenu')

  const handleClick = () => {
    context.setOpen(!context.open)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    } as any)
  }

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({ 
  align = 'start', 
  children,
  className = ''
}: { 
  align?: 'start' | 'end' | 'center'
  children: React.ReactNode
  className?: string
}) {
  const context = useContext(DropdownMenuContext)
  if (!context) throw new Error('DropdownMenuContent must be inside DropdownMenu')

  if (!context.open) return null

  const alignClass = align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'

  return (
    <div
      className={`absolute top-full mt-2 z-50 ${alignClass} min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ 
  children, 
  onClick, 
  className = '' 
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  const context = useContext(DropdownMenuContext)
  if (!context) throw new Error('DropdownMenuItem must be inside DropdownMenu')

  const handleClick = () => {
    onClick?.()
    context.setOpen(false)
  }

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className = '' }: { className?: string }) {
  return <div className={`border-t border-gray-200 my-1 ${className}`} />
}

