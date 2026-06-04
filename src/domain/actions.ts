import type { ActionDef, ActionId } from './types'

/** Дефолтная палитра действий (приближение к чартам FunFarm; уточняется пипеткой). */
export const ACTION_DEFS: Record<ActionId, ActionDef> = {
  fold: { id: 'fold', label: 'Fold', color: '#ffffff' },
  open: { id: 'open', label: 'Open', color: '#ef9a9a' },
  raise: { id: 'raise', label: 'Raise', color: '#ef9a9a' },
  '3bet': { id: '3bet', label: '3-bet', color: '#ef9a9a' },
  '4bet': { id: '4bet', label: '4-bet', color: '#b39ddb' },
  call: { id: 'call', label: 'Call', color: '#a5d6a7' },
  limp: { id: 'limp', label: 'Limp', color: '#a5d6a7' },
  check: { id: 'check', label: 'Check', color: '#a5d6a7' },
  iso_small: { id: 'iso_small', label: 'Iso 3.5bb', color: '#f4a6a6' },
  iso_big: { id: 'iso_big', label: 'Iso 5bb+', color: '#e53935' },
  overlimp: { id: 'overlimp', label: 'Overlimp', color: '#fff59d' },
  limp_call: { id: 'limp_call', label: 'Limp-call', color: '#a5d6a7' },
  limp_fold: { id: 'limp_fold', label: 'Limp-fold', color: '#e0e0e0' },
}

export function actionDef(id: ActionId): ActionDef {
  return ACTION_DEFS[id]
}
