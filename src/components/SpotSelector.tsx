import type { Spot } from '../domain/types'

interface SpotSelectorProps {
  spots: Spot[]
  activeId: string
  onSelect: (id: string) => void
}

/** Кнопки выбора спота внутри категории. */
export function SpotSelector({ spots, activeId, onSelect }: SpotSelectorProps) {
  return (
    <div className="spots">
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
