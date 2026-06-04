import type { Spot } from '../domain/types'
import { useHorizontalWheel } from '../hooks/useHorizontalWheel'

interface SpotSelectorProps {
  spots: Spot[]
  activeId: string
  onSelect: (id: string) => void
}

/** Кнопки выбора спота внутри категории. */
export function SpotSelector({ spots, activeId, onSelect }: SpotSelectorProps) {
  const ref = useHorizontalWheel<HTMLDivElement>()
  return (
    <div className="spots" ref={ref}>
      {spots.map((spot) => (
        <button
          key={spot.id}
          className={`spot ${spot.id === activeId ? 'spot--active' : ''}`}
          onClick={() => onSelect(spot.id)}
        >
          {spot.name}
        </button>
      ))}
    </div>
  )
}
