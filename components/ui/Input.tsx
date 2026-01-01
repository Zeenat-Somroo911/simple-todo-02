import React from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  fullWidth = true,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  const baseStyles = 'px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200'

  const stateStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'

  const disabledStyles = props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
  const widthStyles = fullWidth ? 'w-full' : ''
  const iconPadding = icon ? 'pl-10' : ''

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            baseStyles,
            stateStyles,
            disabledStyles,
            widthStyles,
            iconPadding,
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
