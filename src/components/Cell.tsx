import { memo } from 'react'
import type { Frequency, HandType } from '../domain/types'
import type { HandStatus } from '../domain/grading'
import { ACTION_DEFS } from '../domain/actions'

interface CellProps {
  handId: string
  type: HandType
  freq: Frequency
  status?: HandStatus
}

/**
 * CSS-фон ячейки из распределения частот: диагональные полосы (135°),
 * ширина ∝ частоте. Пусто / только fold → прозрачный.
 */
function backgroundFor(freq: Frequency): string | null {
  const entries = Object.entries(freq)
    .filter(([action, pct]) => action !== 'fold' && (pct ?? 0) > 0)
    .map(([action, pct]) => ({
      color: ACTION_DEFS[action as keyof typeof ACTION_DEFS].color,
      pct: pct!,
    }))

  if (entries.length === 0) return null
  if (entries.length === 1) return entries[0].color

  const total = entries.reduce((s, e) => s + e.pct, 0)
  let acc = 0
  const stops: string[] = []
  for (const e of entries) {
    const start = (acc / total) * 100
    acc += e.pct
    const end = (acc / total) * 100
    stops.push(`${e.color} ${start}%`, `${e.color} ${end}%`)
  }
  return `linear-gradient(135deg, ${stops.join(', ')})`
}

function CellImpl({ handId, type, freq, status }: CellProps) {
  const bg = backgroundFor(freq)
  const isGradient = !!bg && bg.startsWith('linear-gradient')
  const statusClass = status && status !== 'fold_correct' ? `cell--${status}` : ''
  const empty = bg === null

  const style = !bg
    ? undefined
    : isGradient
      ? { backgroundImage: bg }
      : { backgroundColor: bg }

  return (
    <div
      className={`cell cell--${type} ${empty ? 'cell--empty' : ''} ${statusClass}`}
      style={style}
      data-hand={handId}
    >
      <span className="cell__label">{handId}</span>
    </div>
  )
}

export const Cell = memo(CellImpl)
