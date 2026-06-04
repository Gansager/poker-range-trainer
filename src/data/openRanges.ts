import type { ActionId, Matrix } from '../domain/types'

/**
 * Открывающие диапазоны (RFI), черновик на основе чарта FunFarm «Preflop RFI».
 * Целевые частоты из шапки чарта (GTO): EP ~17, MP ~19, HJ ~28, CO ~38, BTN ~54.
 * Ренджи прогрессивные (каждая позиция = предыдущая + добавления). Все руки 100% open;
 * пограничные смешанные частоты тюнингуются в редакторе.
 */

function single(action: ActionId, handIds: string[]): Matrix {
  const m: Matrix = {}
  for (const id of handIds) m[id] = { [action]: 100 }
  return m
}

/** Объединение списков рук без дублей. */
function union(...lists: string[][]): string[] {
  return [...new Set(lists.flat())]
}

const PAIRS = ['22', '33', '44', '55', '66', '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA']

// EP (~17%)
const EP_LIST = union(
  PAIRS,
  // suited
  ['A2s', 'A3s', 'A4s', 'A5s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs',
   'K9s', 'KTs', 'KJs', 'KQs', 'QTs', 'QJs', 'JTs', 'T9s', '98s', '87s', '76s'],
  // offsuit
  ['AJo', 'AQo', 'AKo', 'KQo'],
)

// MP (~19-21%)
const MP_LIST = union(EP_LIST, [
  'A6s', 'A7s', 'A8s', 'Q9s', 'J9s', 'T8s', '97s', '65s',
  'ATo', 'KJo', 'QJo',
])

// HJ (~28%)
const HJ_LIST = union(MP_LIST, [
  'K7s', 'K8s', 'Q8s', 'J8s', 'T7s', '86s', '75s', '64s', '54s',
  'A4o', 'A5o', 'A7o', 'A8o', 'A9o', 'KTo', 'QTo', 'JTo',
])

// CO (~38-40%)
const CO_LIST = union(HJ_LIST, [
  'K2s', 'K3s', 'K4s', 'K5s', 'K6s', 'Q5s', 'Q6s', 'Q7s', 'J7s',
  'T6s', '96s', '85s', '74s', '63s', '53s', '43s',
  'A2o', 'A3o', 'A6o', 'K9o', 'Q9o', 'J9o', 'T9o', '98o',
])

// BTN (~52-55%) — почти все suited + широкий offsuit
const BTN_LIST = union(CO_LIST, [
  // оставшиеся suited
  'Q2s', 'Q3s', 'Q4s', 'J2s', 'J3s', 'J4s', 'J5s', 'J6s',
  'T2s', 'T3s', 'T4s', 'T5s', '92s', '93s', '94s', '95s',
  '82s', '83s', '84s', '72s', '73s', '62s', '52s', '42s', '32s',
  // offsuit
  'K5o', 'K6o', 'K7o', 'K8o', 'Q8o', 'J8o', 'T8o', '87o', '76o', '65o',
])

export const OPEN_RANGES = {
  ep: single('open', EP_LIST),
  mp: single('open', MP_LIST),
  hj: single('open', HJ_LIST),
  co: single('open', CO_LIST),
  btn: single('open', BTN_LIST),
}
