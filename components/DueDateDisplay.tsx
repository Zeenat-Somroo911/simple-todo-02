import { Calendar, Clock } from 'lucide-react'
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns'

interface DueDateDisplayProps {
  dueDate?: string
  completed?: boolean
  size?: 'sm' | 'md'
}

export default function DueDateDisplay({ dueDate, completed = false, size = 'md' }: DueDateDisplayProps) {
  if (!dueDate) return null

  const date = new Date(dueDate)
  const isOverdue = isPast(date) && !completed
  const isDueToday = isToday(date)
  const isDueTomorrow = isTomorrow(date)
  const daysUntilDue = differenceInDays(date, new Date())

  let displayText = format(date, 'MMM d, yyyy')
  let colorClasses = 'bg-gray-100 text-gray-700 border-gray-300'
  let Icon = Calendar

  if (completed) {
    colorClasses = 'bg-green-100 text-green-700 border-green-300'
  } else if (isOverdue) {
    displayText = `Overdue - ${format(date, 'MMM d')}`
    colorClasses = 'bg-red-100 text-red-700 border-red-300'
    Icon = Clock
  } else if (isDueToday) {
    displayText = 'Due Today'
    colorClasses = 'bg-orange-100 text-orange-700 border-orange-300'
    Icon = Clock
  } else if (isDueTomorrow) {
    displayText = 'Due Tomorrow'
    colorClasses = 'bg-yellow-100 text-yellow-700 border-yellow-300'
  } else if (daysUntilDue <= 7 && daysUntilDue > 0) {
    displayText = `${daysUntilDue} days left`
    colorClasses = 'bg-blue-100 text-blue-700 border-blue-300'
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-md font-medium border
        ${colorClasses} ${sizeClasses[size]}
      `}
    >
      <Icon className={iconSizeClasses[size]} />
      <span>{displayText}</span>
    </span>
  )
}
