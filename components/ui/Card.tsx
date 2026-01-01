import React from 'react'
import { cn } from '@/lib/cn'

export interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'bordered' | 'elevated'
  padding?: 'sm' | 'md' | 'lg' | 'none'
  hover?: boolean
  className?: string
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className
}: CardProps) {
  const baseStyles = 'bg-white rounded-lg'

  const variantStyles = {
    default: 'border border-gray-200',
    bordered: 'border-2 border-gray-300',
    elevated: 'shadow-md'
  }

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200' : ''

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        hoverStyles,
        className
      )}
    >
      {children}
    </div>
  )
}
