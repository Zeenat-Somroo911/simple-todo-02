import { Calendar } from 'lucide-react'

interface DueDatePickerProps {
  value?: string
  onChange: (date: string) => void
  label?: string
  className?: string
}

export default function DueDatePicker({ value, onChange, label = 'Due Date', className = '' }: DueDatePickerProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-700 mb-2.5">
        {label}
      </label>
      <div className="relative">
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full px-4 py-2.5 pr-12 border-2 border-slate-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400
            bg-white text-gray-900
            [&::-webkit-calendar-picker-indicator]:opacity-0
            [&::-webkit-calendar-picker-indicator]:absolute
            [&::-webkit-calendar-picker-indicator]:right-0
            [&::-webkit-calendar-picker-indicator]:w-full
            [&::-webkit-calendar-picker-indicator]:h-full
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
          "
          style={{
            colorScheme: 'light'
          }}
        />
      </div>
    </div>
  )
}
