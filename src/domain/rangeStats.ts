import type { ActionId, Matrix } from './types'

/** Всего возможных комбо в холдеме. */
export const TOTAL_COMBOS = 1326

/** Кол-во комбинаций руки: пара = 6, одномастная = 4, разномастная = 12. */
export function comboWeight(handId: string): number {
  if (handId.length === 2) return 6 // пара
  return handId.endsWith('s') ? 4 : 12
}

export interface RangeStats {
  /** Доля диапазона от всех комбо, % (0..100). */
  total: number
  /** Доля по каждому действию, % от всех комбо. */
  byAction: Partial<Record<ActionId, number>>
  /** Кол-во занятых комбинаций (не-фолд). */
  combos: number
}

/**
 * Считает «вес» диапазона относительно всех 1326 комбо.
 * Частичные частоты учитываются пропорционально (напр. 3бет 35% от руки).
 */
export function rangeStats(matrix: Matrix): RangeStats {
  const byCombos: Partial<Record<ActionId, number>> = {}
  let totalCombos = 0

  for (const [handId, freq] of Object.entries(matrix)) {
    const w = comboWeight(handId)
    for (const [action, pct] of Object.entries(freq)) {
      if (action === 'fold' || !pct) continue
      const combos = (w * pct) / 100
      byCombos[action as ActionId] = (byCombos[action as ActionId] ?? 0) + combos
      totalCombos += combos
    }
  }

  const round1 = (c: number) => Math.round((c / TOTAL_COMBOS) * 1000) / 10
  const byAction: Partial<Record<ActionId, number>> = {}
  for (const [a, c] of Object.entries(byCombos)) byAction[a as ActionId] = round1(c!)

  return { total: round1(totalCombos), byAction, combos: Math.round(totalCombos) }
}
