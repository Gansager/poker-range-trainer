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

/** Цвет «фолд»-доли в ячейке (как пустая клетка). */
const FOLD_COLOR = '#1d212c'

/**
 * CSS-фон ячейки из распределения частот: диагональные полосы (135°),
 * ширина ∝ частоте. Недостающая до 100% доля показывается как фолд —
 * поэтому 80% действия визуально отличается от 100%.
 * Пусто / только fold → null (прозрачная пустая клетка).
 */
function backgroundFor(freq: Frequency): string | null {
  const entries = Object.entries(freq)
    .filter(([action, pct]) => action !== 'fold' && (pct ?? 0) > 0)
    .map(([action, pct]) => ({
      color: ACTION_DEFS[action as keyof typeof ACTION_DEFS].color,
      pct: pct!,
    }))

  if (entries.length === 0) return null

  const sumNonFold = entries.reduce((s, e) => s + e.pct, 0)
  const foldPct = Math.max(0, 100 - sumNonFold)

  // Одно действие на 100% → сплошной цвет.
  if (entries.length === 1 && foldPct === 0) return entries[0].color

  // Иначе диагональные полосы: действия + остаток (фолд).
  const segments = [...entries]
  if (foldPct > 0) segments.push({ color: FOLD_COLOR, pct: foldPct })

  const total = segments.reduce((s, e) => s + e.pct, 0)
  let acc = 0
  const stops: string[] = []
  for (const seg of segments) {
    const start = (acc / total) * 100
    acc += seg.pct
    const end = (acc / total) * 100
    stops.push(`${seg.color} ${start}%`, `${seg.color} ${end}%`)
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
