'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import CategorySelector from './CategorySelector'
import DueDatePicker from './DueDatePicker'
import { TaskPriority } from '@/types/task'

interface AddTaskFormProps {
  onAdd: (title: string, description: string, priority: TaskPriority, dueDate?: string, category?: string) => Promise<void>
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const titleInputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    setLoading(true)
    try {
      await onAdd(title, description, priority, dueDate || undefined, category || undefined)
      // Reset form
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      setCategory('')
      titleInputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }


  const priorityOptions: { value: TaskPriority; label: string; icon: string; color: string }[] = [
    { value: 'low', label: 'Low', icon: '🔵', color: 'indigo' },
    { value: 'medium', label: 'Medium', icon: '🟡', color: 'amber' },
    { value: 'high', label: 'High', icon: '🔴', color: 'rose' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-2xl border-2 border-slate-200 overflow-hidden transition-all duration-300 shadow-xl"
    >

      <form onSubmit={handleSubmit} className="relative p-6">
        {/* Description Field - Always Visible */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <Textarea
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            rows={4}
            placeholder="Add a new task..."
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 transition-all resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white text-slate-900"
            style={{ 
              overflowY: 'auto',
              scrollbarWidth: 'thin'
            }}
          />
        </div>

        {/* Priority Selector */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPriority(option.value)}
                className={cn(
                  'relative px-4 py-3 rounded-lg font-semibold text-sm transition-all',
                  priority === option.value
                    ? option.value === 'high'
                      ? 'bg-red-500 text-white shadow-lg'
                      : option.value === 'medium'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-5">
          <DueDatePicker value={dueDate} onChange={setDueDate} label="Due Date" />
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2.5">
            Category (optional)
          </label>
          <CategorySelector value={category} onChange={setCategory} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setTitle('')
              setDescription('')
              setPriority('medium')
              setDueDate('')
              setCategory('')
            }}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
