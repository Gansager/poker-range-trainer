import type { ActionId, Frequency, Matrix } from '../domain/types'

/**
 * Строит матрицу из списков рук по действиям (каждая рука 100% указанного действия).
 * Списки должны быть непересекающимися. Для смешанных частот используйте `mixes`.
 */
export function build(
  parts: Partial<Record<ActionId, string[]>>,
  mixes?: Record<string, Frequency>,
): Matrix {
  const m: Matrix = {}
  for (const [action, ids] of Object.entries(parts)) {
    if (!ids) continue
    for (const id of ids) m[id] = { [action as ActionId]: 100 }
  }
  if (mixes) for (const [id, freq] of Object.entries(mixes)) m[id] = freq
  return m
}

/** Возвращает список без указанных рук (для непересекающихся колл/3бет наборов). */
export function except(list: string[], remove: string[]): string[] {
  const set = new Set(remove)
  return list.filter((id) => !set.has(id))
}

// Часто используемые группы рук.
export const ALL_PAIRS = ['22', '33', '44', '55', '66', '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA']
export const SUITED_AX = ['A2s', 'A3s', 'A4s', 'A5s', 'A6s', 'A7s', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs']
export const SUITED_KX = ['K2s', 'K3s', 'K4s', 'K5s', 'K6s', 'K7s', 'K8s', 'K9s', 'KTs', 'KJs', 'KQs']
export const SUITED_QX = ['Q2s', 'Q3s', 'Q4s', 'Q5s', 'Q6s', 'Q7s', 'Q8s', 'Q9s', 'QTs', 'QJs']
export const SUITED_JX = ['J2s', 'J3s', 'J4s', 'J5s', 'J6s', 'J7s', 'J8s', 'J9s', 'JTs']
export const SUITED_CONN = ['54s', '65s', '76s', '87s', '98s', 'T9s', 'T8s', 'J9s', '64s', '75s', '86s', '97s']
