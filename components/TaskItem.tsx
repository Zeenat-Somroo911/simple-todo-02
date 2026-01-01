'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Circle, CheckCircle2, Edit2, Trash2, Clock, Sparkles } from 'lucide-react'
import { Task } from '@/types/task'
import { cn } from '@/lib/cn'
import PriorityBadge from './PriorityBadge'
import CategoryBadge from './CategoryBadge'
import DueDateDisplay from './DueDateDisplay'

interface TaskItemProps {
  task: Task
  onToggle: (taskId: number) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
  onEdit?: (task: Task) => void
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
  }

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await onToggle(task.id)
    } finally {
      // Keep the animation visible for a bit
      setTimeout(() => setIsToggling(false), 400)
    }
  }

  // Priority colors mapping
  const priorityColors = {
    high: {
      border: 'border-rose-500',
      bg: 'bg-rose-500',
      glow: 'shadow-rose-500/20',
    },
    medium: {
      border: 'border-amber-500',
      bg: 'bg-amber-500',
      glow: 'shadow-amber-500/20',
    },
    low: {
      border: 'border-indigo-500',
      bg: 'bg-indigo-500',
      glow: 'shadow-indigo-500/20',
    },
  }

  // Get priority style with fallback to medium if priority is invalid
  const priorityStyle = priorityColors[task.priority] || priorityColors.medium

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group relative bg-white rounded-2xl border-2 transition-all duration-300',
        'hover:shadow-xl',
        task.completed
          ? 'border-slate-200 bg-slate-50/50 opacity-75'
          : cn(
              'border-slate-200',
              isHovered && 'border-indigo-300 shadow-lg shadow-indigo-100/50'
            )
      )}
    >
      {/* Priority Indicator Bar - More prominent */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl transition-all duration-300',
          priorityStyle.bg,
          isHovered && !task.completed && 'w-2'
        )}
      />

      {/* Glow effect on hover for incomplete tasks */}
      {isHovered && !task.completed && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
      )}

      <div className="flex items-start gap-4 p-5">
        {/* Completion Toggle - Enhanced with animation */}
        <motion.button
          onClick={handleToggle}
          disabled={isToggling}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full"
          aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <AnimatePresence mode="wait">
            {task.completed ? (
              <motion.div
                key="completed"
                initial={{ scale: 0.8, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500 drop-shadow-sm" />
              </motion.div>
            ) : (
              <motion.div
                key="incomplete"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                whileHover={{ scale: 1.15 }}
              >
                <Circle
                  className={cn(
                    'w-6 h-6 transition-colors duration-200',
                    isHovered ? 'text-indigo-500 stroke-[2.5]' : 'text-slate-300 stroke-2'
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <motion.h3
            layout
            className={cn(
              'text-base font-semibold mb-2.5 leading-snug transition-colors duration-200',
              task.completed
                ? 'line-through text-slate-400'
                : 'text-slate-900'
            )}
          >
            {task.title}
          </motion.h3>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <PriorityBadge priority={task.priority} size="sm" />
            {task.category && <CategoryBadge category={task.category} size="sm" />}
            {task.due_date && (
              <DueDateDisplay dueDate={task.due_date} completed={task.completed} size="sm" />
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={cn(
                'text-sm mb-3 break-words leading-relaxed transition-colors duration-200',
                task.completed ? 'text-slate-400' : 'text-slate-600'
              )}
            >
              {task.description}
            </p>
          )}

          {/* Footer - Created At */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Created {formatDate(task.created_at)}</span>
          </div>
        </div>

        {/* Action Buttons - Slide in on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 flex gap-1.5"
            >
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgb(238 242 255)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(task)}
                  className={cn(
                    'p-2.5 rounded-lg transition-all',
                    'text-slate-600 hover:text-indigo-600',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1'
                  )}
                  aria-label="Edit task"
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgb(255 228 230)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(task.id)}
                className={cn(
                  'p-2.5 rounded-lg transition-all',
                  'text-slate-600 hover:text-rose-600',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1'
                )}
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Completion celebration effect */}
      {task.completed && isToggling && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-2 right-2"
        >
          <Sparkles className="w-5 h-5 text-emerald-500" />
        </motion.div>
      )}
    </motion.div>
  )
}
