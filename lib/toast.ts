'use client'

import { createContext, useState, useCallback } from 'react'

export interface Toast {
  id: string
  message: string
  variant: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, variant: Toast['variant'], duration?: number) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Generate unique ID for toasts
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function useToastState() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((message: string, variant: Toast['variant'], duration: number = 3000) => {
    const id = generateId()
    const toast: Toast = { id, message, variant, duration }

    setToasts((prev) => [...prev, toast])

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  return {
    toasts,
    addToast,
    removeToast
  }
}
