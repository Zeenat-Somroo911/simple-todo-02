'use client'

import React, { useState } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Toast as ToastType } from '@/lib/toast'

interface ToastProps {
  toast: ToastType
  onRemove: (id: string) => void
}

export function Toast({ toast, onRemove }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleRemove = () => {
    setIsExiting(true)
    setTimeout(() => onRemove(toast.id), 200) // Wait for animation
  }

  const icons = {
    success: <CheckCircle2 className="w-5 h-5" aria-hidden="true" />,
    error: <XCircle className="w-5 h-5" aria-hidden="true" />,
    info: <Info className="w-5 h-5" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5" aria-hidden="true" />
  }

  const variantStyles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800'
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg transition-all duration-200',
        variantStyles[toast.variant],
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.variant]}</div>

      <p className="flex-1 text-sm font-medium">{toast.message}</p>

      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastType[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}
