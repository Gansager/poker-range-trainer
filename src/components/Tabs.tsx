import type { Category } from '../domain/types'

interface TabsProps {
  categories: Category[]
  activeId: string
  onSelect: (id: string) => void
}

/** Верхние табы категорий. */
export function Tabs({ categories, activeId, onSelect }: TabsProps) {
  return (
    <nav className="tabs">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`tab ${cat.id === activeId ? 'tab--active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  )
}
