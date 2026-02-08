'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './ui/Modal'
import { Task, TaskPriority } from '@/types/task'
import CategorySelector from './CategorySelector'
import DueDatePicker from './DueDatePicker'

export interface EditTaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave: (taskId: number, data: {
    title: string
    description: string
    priority: TaskPriority
    due_date?: string
    category?: string
  }) => Promise<void>
}

export function EditTaskModal({ task, isOpen, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      // Convert ISO date to YYYY-MM-DD format for date input
      if (task.due_date) {
        const date = new Date(task.due_date)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        setDueDate(`${year}-${month}-${day}`)
      } else {
        setDueDate('')
      }
      setCategory(task.category || '')
      setError('')
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!task) return

    setLoading(true)
    try {
      await onSave(task.id, {
        title,
        description,
        priority,
        due_date: dueDate || undefined,
        category: category || undefined
      })
      onClose()
    } catch (error: unknown) {
      setError((error as { response?: { data?: { detail?: { error?: { message?: string } } } } })?.response?.data?.detail?.error?.message || 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      size="lg"
      footer={
        <div className="flex gap-2 sm:gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Description Field */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            maxLength={200}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 transition-all resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white text-slate-900"
            style={{ 
              overflowY: 'auto',
              scrollbarWidth: 'thin'
            }}
            required
            autoFocus
          />
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`
                  px-4 py-3 rounded-lg font-semibold text-sm transition-all
                  ${priority === p
                    ? p === 'high'
                      ? 'bg-red-500 text-white shadow-lg'
                      : p === 'medium'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                  }
                `}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <DueDatePicker value={dueDate} onChange={setDueDate} label="Due Date" />

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2.5">
            Category (optional)
          </label>
          <CategorySelector value={category} onChange={setCategory} />
        </div>
      </form>
    </Modal>
  )
}
