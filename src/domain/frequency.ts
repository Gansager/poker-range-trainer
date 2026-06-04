import type { ActionId, Frequency } from './types'

/** Сумма всех не-фолд частот в ячейке. */
export function sumNonFold(freq: Frequency): number {
  let s = 0
  for (const [a, p] of Object.entries(freq)) {
    if (a !== 'fold') s += p ?? 0
  }
  return s
}

/** Есть ли в ячейке хоть одно не-фолд действие. */
export function hasAction(freq: Frequency | undefined): boolean {
  return !!freq && sumNonFold(freq) > 0
}

/**
 * Назначает действию `action` вес `weight` (0..100) в ячейке.
 * Остальные не-фолд действия масштабируются, чтобы сумма ≤ 100; остаток уходит в fold.
 * weight = 0 → действие удаляется. weight = 100 → ячейка становится чистой.
 */
export function setCellAction(freq: Frequency, action: ActionId, weight: number): Frequency {
  const w = Math.max(0, Math.min(100, Math.round(weight)))

  // Прочие не-фолд действия (без редактируемого).
  const others: [ActionId, number][] = Object.entries(freq)
    .filter(([a, p]) => a !== 'fold' && a !== action && (p ?? 0) > 0)
    .map(([a, p]) => [a as ActionId, p as number])

  const result: Frequency = {}

  if (w >= 100) {
    return { [action]: 100 } // чистое действие
  }
  if (w > 0) result[action] = w

  const room = 100 - w
  const othersSum = others.reduce((s, [, p]) => s + p, 0)
  if (othersSum > 0) {
    const scale = othersSum > room ? room / othersSum : 1
    for (const [a, p] of others) {
      const v = Math.round(p * scale)
      if (v > 0) result[a] = v
    }
  }

  return result
}

/** Удаляет действие из ячейки (toggle-erase). */
export function removeAction(freq: Frequency, action: ActionId): Frequency {
  const result: Frequency = {}
  for (const [a, p] of Object.entries(freq)) {
    if (a !== action && a !== 'fold' && (p ?? 0) > 0) result[a as ActionId] = p as number
  }
  return result
}

/** Нормализует не-фолд частоты к сумме 100 (для инспектора). */
export function normalize(freq: Frequency): Frequency {
  const s = sumNonFold(freq)
  if (s === 0) return {}
  const result: Frequency = {}
  for (const [a, p] of Object.entries(freq)) {
    if (a !== 'fold' && (p ?? 0) > 0) result[a as ActionId] = Math.round(((p as number) / s) * 100)
  }
  return result
}
