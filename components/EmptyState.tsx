import React from 'react'
import { Button } from './ui/Button'

export interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-gray-300 mb-4">{icon}</div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      <p className="text-gray-500 mb-6 max-w-md">{description}</p>

      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  )
}
