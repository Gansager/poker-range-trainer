import type { ActionId, Frequency, Matrix } from './types'
import { ALL_HAND_IDS } from './hands'

/** Статус руки после проверки. */
export type HandStatus =
  | 'fold_correct' // обе стороны фолд — нейтрально
  | 'correct' // эталон не-фолд, игрок попал
  | 'wrong' // эталон не-фолд, игрок выбрал другое не-фолд действие
  | 'missed' // эталон не-фолд, игрок оставил фолд
  | 'extra' // эталон фолд, игрок поставил действие

export interface GradeResult {
  byHand: Record<string, HandStatus>
  counts: Record<HandStatus, number>
  /** Кол-во «значимых» рук (где эталон или ответ не фолд). */
  relevant: number
  /** Точность по значимым рукам: correct / relevant, в процентах (0..100). */
  accuracy: number
  /** ID рук с ошибками (wrong/missed/extra). */
  mistakes: string[]
}

/** Доминирующее не-фолд действие распределения (или 'fold'). */
export function dominantAction(freq: Frequency | undefined): ActionId {
  if (!freq) return 'fold'
  let best: ActionId = 'fold'
  let bestPct = 0
  for (const [action, pct] of Object.entries(freq)) {
    if (action === 'fold') continue
    if ((pct ?? 0) > bestPct) {
      bestPct = pct ?? 0
      best = action as ActionId
    }
  }
  return best
}

/** Действия эталона с частотой ≥ threshold (исключая fold). */
function refActionsAbove(freq: Frequency | undefined, threshold: number): Set<ActionId> {
  const set = new Set<ActionId>()
  if (!freq) return set
  for (const [action, pct] of Object.entries(freq)) {
    if (action === 'fold') continue
    if ((pct ?? 0) >= threshold) set.add(action as ActionId)
  }
  return set
}

/**
 * Режим A — «Действие».
 * Рука верна, если выбранное игроком действие совпадает с любым действием эталона
 * частотой ≥ threshold. Частоты игрока не учитываются (берём доминирующее действие).
 */
export function gradeModeA(
  answer: Matrix,
  reference: Matrix,
  threshold = 1,
): GradeResult {
  const byHand: Record<string, HandStatus> = {}
  const counts: Record<HandStatus, number> = {
    fold_correct: 0,
    correct: 0,
    wrong: 0,
    missed: 0,
    extra: 0,
  }
  const mistakes: string[] = []

  for (const handId of ALL_HAND_IDS) {
    const userAction = dominantAction(answer[handId])
    const refSet = refActionsAbove(reference[handId], threshold)
    const refIsFold = refSet.size === 0

    let status: HandStatus
    if (userAction === 'fold') {
      status = refIsFold ? 'fold_correct' : 'missed'
    } else if (refIsFold) {
      status = 'extra'
    } else {
      status = refSet.has(userAction) ? 'correct' : 'wrong'
    }

    byHand[handId] = status
    counts[status]++
    if (status === 'wrong' || status === 'missed' || status === 'extra') {
      mistakes.push(handId)
    }
  }

  const relevant = counts.correct + counts.wrong + counts.missed + counts.extra
  const accuracy = relevant === 0 ? 100 : Math.round((counts.correct / relevant) * 100)

  return { byHand, counts, relevant, accuracy, mistakes }
}

/** Все действия (не-фолд) обеих сторон с частотами. */
function allActions(a: Frequency, b: Frequency): Set<ActionId> {
  const set = new Set<ActionId>()
  for (const k of Object.keys(a)) if (k !== 'fold') set.add(k as ActionId)
  for (const k of Object.keys(b)) if (k !== 'fold') set.add(k as ActionId)
  return set
}

/**
 * Режим B — «Точные частоты».
 * Рука верна, если по КАЖДОМУ действию |ответ% − эталон%| ≤ tolerance.
 */
export function gradeModeB(answer: Matrix, reference: Matrix, tolerance = 10): GradeResult {
  const byHand: Record<string, HandStatus> = {}
  const counts: Record<HandStatus, number> = {
    fold_correct: 0,
    correct: 0,
    wrong: 0,
    missed: 0,
    extra: 0,
  }
  const mistakes: string[] = []

  for (const handId of ALL_HAND_IDS) {
    const ans = answer[handId] ?? {}
    const ref = reference[handId] ?? {}
    const userHas = Object.entries(ans).some(([a, p]) => a !== 'fold' && (p ?? 0) > 0)
    const refHas = Object.entries(ref).some(([a, p]) => a !== 'fold' && (p ?? 0) > 0)

    let status: HandStatus
    if (!userHas && !refHas) {
      status = 'fold_correct'
    } else if (!userHas && refHas) {
      status = 'missed'
    } else if (userHas && !refHas) {
      status = 'extra'
    } else {
      // Сравниваем частоты по всем действиям.
      let ok = true
      for (const a of allActions(ans, ref)) {
        const diff = Math.abs((ans[a] ?? 0) - (ref[a] ?? 0))
        if (diff > tolerance) {
          ok = false
          break
        }
      }
      status = ok ? 'correct' : 'wrong'
    }

    byHand[handId] = status
    counts[status]++
    if (status === 'wrong' || status === 'missed' || status === 'extra') mistakes.push(handId)
  }

  const relevant = counts.correct + counts.wrong + counts.missed + counts.extra
  const accuracy = relevant === 0 ? 100 : Math.round((counts.correct / relevant) * 100)
  return { byHand, counts, relevant, accuracy, mistakes }
}

export type GradeMode = 'A' | 'B'

/** Единая точка входа: грейд по выбранному режиму. */
export function grade(
  answer: Matrix,
  reference: Matrix,
  mode: GradeMode,
  tolerance = 10,
): GradeResult {
  return mode === 'A' ? gradeModeA(answer, reference) : gradeModeB(answer, reference, tolerance)
}
