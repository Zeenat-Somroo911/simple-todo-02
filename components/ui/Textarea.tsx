import React from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  fullWidth = true,
  className,
  id,
  ...props
}, ref) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  const baseStyles = 'px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors duration-200 resize-y min-h-[100px]'

  const stateStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-teal-500 focus:ring-teal-200'

  const disabledStyles = props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
  const widthStyles = fullWidth ? 'w-full' : ''

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          baseStyles,
          stateStyles,
          disabledStyles,
          widthStyles,
          className
        )}
        {...props}
      />

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

Textarea.displayName = 'Textarea'
