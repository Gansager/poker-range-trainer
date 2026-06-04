import { build } from './buildMatrix'

/**
 * VPIP vs 1 raiser (50bb). Реакция на опен: 3бет / колл / фолд.
 * Черновик по теории + структуре чарта FunFarm. Чем позже позиция открывшего —
 * тем шире ответ. Точные руки/частоты сверьте с чартом.
 */

export const VPIP_RANGES = {
  // vs EP open (тайтовый опен): 3бет ~7 / колл ~11
  vs_ep: build({
    '3bet': ['QQ', 'KK', 'AA', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s'],
    call: [
      'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
      'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s',
      'AQo', 'KQo',
    ],
  }),

  // vs MP open: 3бет ~8 / колл ~11
  vs_mp: build({
    '3bet': ['QQ', 'KK', 'AA', 'JJ', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s', 'A3s'],
    call: [
      'TT', '99', '88', '77', '66', '55', '44', '33', '22',
      'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s',
      'AQo', 'AJo', 'KQo',
    ],
  }),

  // vs HJ open: 3бет ~9 / колл ~12
  vs_hj: build({
    '3bet': ['QQ', 'KK', 'AA', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'AQo', 'KQs', 'A5s', 'A4s', 'A3s'],
    call: [
      '99', '88', '77', '66', '55', '44', '33', '22',
      'AJs', 'ATs', 'A9s', 'A8s', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s',
      'AJo', 'ATo', 'KQo', 'KJo', 'QJo',
    ],
  }),

  // vs CO open: 3бет ~11 / колл ~14
  vs_co: build({
    '3bet': [
      'TT', 'JJ', 'QQ', 'KK', 'AA', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'KQs',
      'A2s', 'A3s', 'A4s', 'A5s',
    ],
    call: [
      '99', '88', '77', '66', '55', '44', '33', '22',
      'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s',
      'JTs', 'J9s', 'T9s', 'T8s', '98s', '87s', '76s', '65s',
      'AJo', 'ATo', 'KQo', 'KJo', 'QJo',
    ],
  }),

  // vs BTN open (широкий опен): 3бет ~12 / колл ~16
  vs_btn: build({
    '3bet': [
      '99', 'TT', 'JJ', 'QQ', 'KK', 'AA', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'ATs', 'KQs', 'KJs', 'KTs',
      'A2s', 'A3s', 'A4s', 'A5s',
    ],
    call: [
      '88', '77', '66', '55', '44', '33', '22',
      'A9s', 'A8s', 'A7s', 'A6s', 'K9s', 'K8s', 'QJs', 'QTs', 'Q9s',
      'JTs', 'J9s', 'T9s', 'T8s', '98s', '87s', '76s', '65s', '54s',
      'AJo', 'ATo', 'A9o', 'KQo', 'KJo', 'KTo', 'QJo', 'QTo', 'JTo',
    ],
  }),
}
