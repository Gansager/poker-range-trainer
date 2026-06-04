import type { ActionDef, ActionId } from './types'

/** Дефолтная палитра действий (приближение к чартам FunFarm; уточняется пипеткой). */
export const ACTION_DEFS: Record<ActionId, ActionDef> = {
  fold: { id: 'fold', label: 'Фолд', color: '#ffffff' },
  open: { id: 'open', label: 'Опенрейз', color: '#ef9a9a' },
  raise: { id: 'raise', label: 'Рейз', color: '#ef9a9a' },
  '3bet': { id: '3bet', label: '3бет', color: '#ef9a9a' },
  '4bet': { id: '4bet', label: '4бет', color: '#b39ddb' },
  call: { id: 'call', label: 'Колл', color: '#a5d6a7' },
  limp: { id: 'limp', label: 'Лимп', color: '#a5d6a7' },
  check: { id: 'check', label: 'Чек', color: '#a5d6a7' },
  iso_small: { id: 'iso_small', label: 'Изолейт 3.5bb', color: '#f4a6a6' },
  iso_big: { id: 'iso_big', label: 'Изолейт 5bb+', color: '#e53935' },
  overlimp: { id: 'overlimp', label: 'Оверлимп', color: '#fff59d' },
  limp_call: { id: 'limp_call', label: 'Лимп-колл', color: '#a5d6a7' },
  limp_fold: { id: 'limp_fold', label: 'Лимп-фолд', color: '#e0e0e0' },
}

export function actionDef(id: ActionId): ActionDef {
  return ACTION_DEFS[id]
}
