import { Tag } from 'lucide-react'
import { categoryColors } from '@/lib/theme'

interface CategoryBadgeProps {
  category?: string
  size?: 'sm' | 'md'
}

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  if (!category) return null

  const categoryConfig = categoryColors.find(c => c.name === category) || categoryColors[categoryColors.length - 1]

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
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: categoryConfig.bg,
        color: categoryConfig.color,
      }}
    >
      <Tag className={iconSizeClasses[size]} />
      <span>{category}</span>
    </span>
  )
}
