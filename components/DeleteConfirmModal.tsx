'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  taskTitle: string
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop - lighter and less blur */}
      <div
        className="fixed inset-0 bg-black/30 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Very Compact Modal */}
      <div
        className="relative bg-white rounded-md shadow-2xl w-full max-w-[280px] my-auto z-[10000] border border-gray-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - compact */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-800">Delete Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body - minimal padding */}
        <div className="px-3 py-3">
          <p className="text-xs text-gray-700 leading-relaxed">
            Delete <span className="font-medium text-gray-900">&apos;{taskTitle}&apos;</span>?
          </p>
          <p className="text-[10px] text-gray-500 mt-1">This cannot be undone.</p>
        </div>

        {/* Footer - compact buttons */}
        <div className="flex gap-2 px-3 pb-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 border border-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-2.5 py-1.5 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
