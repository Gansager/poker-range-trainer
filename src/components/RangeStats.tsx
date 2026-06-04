import { useMemo } from 'react'
import type { Matrix } from '../domain/types'
import { rangeStats } from '../domain/rangeStats'
import { ACTION_DEFS } from '../domain/actions'

interface RangeStatsProps {
  matrix: Matrix
}

/** Строка статистики: какой % всех комбо занимает диапазон, с разбивкой по действиям. */
export function RangeStats({ matrix }: RangeStatsProps) {
  const stats = useMemo(() => rangeStats(matrix), [matrix])
  const actions = Object.entries(stats.byAction).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))

  return (
    <div className="rangestats">
      <span className="rangestats__total">
        Range: <b>{stats.total}%</b>
      </span>
      <span className="rangestats__combos">{stats.combos} / 1326 combos</span>
      {actions.map(([action, pct]) => {
        const def = ACTION_DEFS[action as keyof typeof ACTION_DEFS]
        return (
          <span key={action} className="rangestats__chip">
            <span className="rangestats__swatch" style={{ background: def.color }} />
            {def.label} {pct}%
          </span>
        )
      })}
    </div>
  )
}
