'use client'

import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from './ui/Input'

export interface TaskSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TaskSearch({ value, onChange, placeholder = 'Search tasks...' }: TaskSearchProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        icon={<Search className="w-5 h-5" />}
        fullWidth
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
