import type { Hand, HandType } from './types'

/** Ранги от старшего к младшему — порядок строк/столбцов матрицы. */
export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const

export const GRID_SIZE = RANKS.length // 13
export const HAND_COUNT = GRID_SIZE * GRID_SIZE // 169

/**
 * Возвращает руку в позиции (row, col) сетки 13×13.
 * Соглашение (как на чартах):
 *  - диагональ        → карманные пары (AA…22)
 *  - верх-право (row<col) → одномастные (suited): "AKs"
 *  - низ-лево  (row>col)  → разномастные (offsuit): "AKo"
 */
export function handAt(row: number, col: number): Hand {
  const high = RANKS[Math.min(row, col)]
  const low = RANKS[Math.max(row, col)]

  let id: string
  let type: HandType

  if (row === col) {
    id = high + low // пара, напр. "AA"
    type = 'pair'
  } else if (row < col) {
    id = high + low + 's'
    type = 'suited'
  } else {
    id = high + low + 'o'
    type = 'offsuit'
  }

  return { id, type, row, col }
}

/** Генерирует все 169 рук в порядке строк (row 0..12, col 0..12). */
export function generateHands(): Hand[] {
  const hands: Hand[] = []
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      hands.push(handAt(row, col))
    }
  }
  return hands
}

/** Все 169 рук (мемоизировано на уровне модуля). */
export const ALL_HANDS: Hand[] = generateHands()

/** Список из 169 канонических ID рук. */
export const ALL_HAND_IDS: string[] = ALL_HANDS.map((h) => h.id)
