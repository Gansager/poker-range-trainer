import type { Category } from '../domain/types'
import { useHorizontalWheel } from '../hooks/useHorizontalWheel'

interface TabsProps {
  categories: Category[]
  activeId: string
  onSelect: (id: string) => void
}

/** Верхние табы категорий. */
export function Tabs({ categories, activeId, onSelect }: TabsProps) {
  const ref = useHorizontalWheel<HTMLElement>()
  return (
    <nav className="tabs" ref={ref}>
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
