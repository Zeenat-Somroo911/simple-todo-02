import React from 'react'
import { cn } from '@/lib/cn'

export interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string
  height?: string
  count?: number
  className?: string
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  count = 1,
  className
}: SkeletonProps) {
  const baseStyles = 'bg-gray-200 animate-pulse'

  const variantStyles = {
    text: 'rounded h-4',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  }

  const skeletonElement = (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? undefined : '100px')
      }}
      aria-hidden="true"
    />
  )

  if (count === 1) {
    return skeletonElement
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{skeletonElement}</div>
      ))}
    </>
  )
}

// Preset skeleton patterns
export function TaskItemSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width="20px" height="20px" />
        <Skeleton variant="text" width="60%" height="20px" />
      </div>
      <Skeleton variant="text" width="90%" height="16px" />
      <Skeleton variant="text" width="40%" height="14px" />
    </div>
  )
}
