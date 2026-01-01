import { categoryColors } from '@/lib/theme'

interface CategorySelectorProps {
  value?: string
  onChange: (category: string) => void
  className?: string
}

export default function CategorySelector({ value, onChange, className = '' }: CategorySelectorProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categoryColors.map((cat) => {
        const isSelected = value === cat.name

        return (
          <button
            key={cat.name}
            type="button"
            onClick={() => onChange(cat.name)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                isSelected
                  ? 'ring-2 ring-offset-2 shadow-md scale-105'
                  : 'hover:scale-105 hover:shadow-sm'
              }
            `}
            style={{
              backgroundColor: isSelected ? cat.color : cat.bg,
              color: isSelected ? 'white' : cat.color,
            }}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
