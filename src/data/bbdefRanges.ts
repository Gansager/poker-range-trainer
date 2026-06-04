import { build, except, ALL_PAIRS } from './buildMatrix'

/**
 * BB defense против опена (одиночный сайз ~2.5bb). Действия: 3бет / колл / фолд.
 * BB защищается широко (закрывает экшн, хорошая цена), 3бет поляризованный.
 * Черновик по теории; на чарте есть отдельные сайзы 2.0/2.5/3.0 — здесь усреднённый.
 */

// Широкий «универсум» рук, которые BB обычно защищает (колл или 3бет).
const DEF_SUITED = [
  // suited Ax
  'A2s', 'A3s', 'A4s', 'A5s', 'A6s', 'A7s', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'AKs',
  // suited Kx
  'K2s', 'K3s', 'K4s', 'K5s', 'K6s', 'K7s', 'K8s', 'K9s', 'KTs', 'KJs', 'KQs',
  // suited Qx
  'Q4s', 'Q5s', 'Q6s', 'Q7s', 'Q8s', 'Q9s', 'QTs', 'QJs',
  // suited Jx
  'J6s', 'J7s', 'J8s', 'J9s', 'JTs',
  // suited Tx / коннекторы
  'T6s', 'T7s', 'T8s', 'T9s', '96s', '97s', '98s', '86s', '87s', '75s', '76s', '64s', '65s', '53s', '54s', '43s',
]

const DEF_OFFSUIT_WIDE = [
  'A2o', 'A3o', 'A4o', 'A5o', 'A6o', 'A7o', 'A8o', 'A9o', 'ATo', 'AJo', 'AQo', 'AKo',
  'K7o', 'K8o', 'K9o', 'KTo', 'KJo', 'KQo',
  'Q8o', 'Q9o', 'QTo', 'QJo',
  'J8o', 'J9o', 'JTo', 'T8o', 'T9o', '98o', '87o', '76o', '65o',
]

const DEF_OFFSUIT_NARROW = [
  'A2o', 'A3o', 'A4o', 'A5o', 'A6o', 'A7o', 'A8o', 'A9o', 'ATo', 'AJo', 'AQo', 'AKo',
  'K9o', 'KTo', 'KJo', 'KQo', 'Q9o', 'QTo', 'QJo', 'J9o', 'JTo', 'T9o', '98o',
]

function bbDef(threeBet: string[], offsuit: string[]) {
  const callUniverse = [...ALL_PAIRS, ...DEF_SUITED, ...offsuit]
  return build({ '3bet': threeBet, call: except(callUniverse, threeBet) })
}

export const BBDEF_RANGES = {
  // vs EP open (тайтовый): 3бет узко-поляризованный
  vs_ep: bbDef(
    ['QQ', 'KK', 'AA', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s', 'A3s'],
    DEF_OFFSUIT_NARROW,
  ),
  // vs MP open
  vs_mp: bbDef(
    ['JJ', 'QQ', 'KK', 'AA', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s', 'A3s', 'A2s', 'KJs'],
    DEF_OFFSUIT_NARROW,
  ),
  // vs HJ open
  vs_hj: bbDef(
    ['TT', 'JJ', 'QQ', 'KK', 'AA', 'AKs', 'AKo', 'AQs', 'AQo', 'KQs', 'A2s', 'A3s', 'A4s', 'A5s', 'KJs'],
    DEF_OFFSUIT_WIDE,
  ),
  // vs CO open (шире)
  vs_co: bbDef(
    ['99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'KQs', 'KJs',
     'A2s', 'A3s', 'A4s', 'A5s', 'K9s', '76s', '87s'],
    DEF_OFFSUIT_WIDE,
  ),
  // vs BTN open (самый широкий): защита почти всем играбельным
  vs_btn: bbDef(
    ['88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'ATs', 'KQs', 'KJs',
     'A2s', 'A3s', 'A4s', 'A5s', 'K8s', 'K9s', '65s', '76s', '87s', '98s'],
    DEF_OFFSUIT_WIDE,
  ),
}
