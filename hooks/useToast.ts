/**
 * Toast notification hook using react-hot-toast
 * Provides success, error, info, and loading toast methods
 */
import toast from 'react-hot-toast'

export function useToast() {
  return {
    success: (message: string) => {
      toast.success(message, {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      })
    },
    error: (message: string) => {
      toast.error(message, {
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#EF4444',
        },
      })
    },
    info: (message: string) => {
      toast(message, {
        duration: 3000,
        position: 'bottom-right',
        icon: 'ℹ️',
        style: {
          background: '#3B82F6',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontWeight: '500',
        },
      })
    },
    loading: (message: string) => {
      return toast.loading(message, {
        position: 'bottom-right',
        style: {
          background: '#6B7280',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontWeight: '500',
        },
      })
    },
    dismiss: (toastId?: string) => {
      toast.dismiss(toastId)
    },
  }
}
