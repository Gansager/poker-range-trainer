import { build, except, ALL_PAIRS, SUITED_AX, SUITED_KX } from './buildMatrix'
import { ALL_HAND_IDS } from '../domain/hands'

/**
 * Blind vs Blind. Черновик по чарту FunFarm «Игра BvB» + теории.
 * SB играет VPIP 100% (рейз/лимп, без фолда). BB защищается широко.
 */

// SB-опенрейз ~50% (рейзим лучшую половину, остальное лимпим)
const SB_RAISE = [
  ...ALL_PAIRS,
  ...SUITED_AX,
  ...SUITED_KX,
  'Q6s', 'Q7s', 'Q8s', 'Q9s', 'QTs', 'QJs',
  'J7s', 'J8s', 'J9s', 'JTs',
  'T7s', 'T8s', 'T9s',
  '96s', '97s', '98s', '86s', '87s', '75s', '76s', '65s', '54s',
  'A8o', 'A9o', 'ATo', 'AJo', 'AQo', 'AKo',
  'KTo', 'KJo', 'KQo', 'QTo', 'QJo', 'JTo', 'T9o', '98o',
]

// ISO BB против лимпа SB (изолейт ~широко, остальное чек)
const BB_ISO = [
  ...ALL_PAIRS,
  ...SUITED_AX,
  'K5s', 'K6s', 'K7s', 'K8s', 'K9s', 'KTs', 'KJs', 'KQs',
  'Q8s', 'Q9s', 'QTs', 'QJs',
  'J8s', 'J9s', 'JTs', 'T8s', 'T9s', '98s', '87s', '76s', '65s', '54s',
  'A9o', 'ATo', 'AJo', 'AQo', 'AKo', 'KTo', 'KJo', 'KQo', 'QTo', 'QJo', 'JTo',
]

// Широкий колл-универсум BB vs опен SB
const BB_DEF_UNIVERSE = [
  ...ALL_PAIRS,
  ...SUITED_AX,
  ...SUITED_KX,
  'Q4s', 'Q5s', 'Q6s', 'Q7s', 'Q8s', 'Q9s', 'QTs', 'QJs',
  'J6s', 'J7s', 'J8s', 'J9s', 'JTs',
  'T6s', 'T7s', 'T8s', 'T9s', '96s', '97s', '98s', '86s', '87s', '75s', '76s', '64s', '65s', '53s', '54s', '43s',
  'A2o', 'A3o', 'A4o', 'A5o', 'A6o', 'A7o', 'A8o', 'A9o', 'ATo', 'AJo', 'AQo', 'AKo',
  'K7o', 'K8o', 'K9o', 'KTo', 'KJo', 'KQo', 'Q8o', 'Q9o', 'QTo', 'QJo',
  'J8o', 'J9o', 'JTo', 'T8o', 'T9o', '98o', '87o', '76o', '65o',
]
const BB_VS_SB_3BET = [
  'TT', 'JJ', 'QQ', 'KK', 'AA', 'AKs', 'AKo', 'AQs', 'AQo', 'KQs', 'AJs',
  'A2s', 'A3s', 'A4s', 'A5s', 'K9s', '76s', '87s', '98s',
]

export const BVB_RANGES = {
  // SB VPIP 100%: рейз / лимп (фолда нет)
  sb_vpip: build({
    raise: SB_RAISE,
    limp: except(ALL_HAND_IDS, SB_RAISE),
  }),

  // SB открылся и получил 3бет: колл / 4бет / фолд
  sb_vs_3bet: build({
    '4bet': ['QQ', 'KK', 'AA', 'AKs', 'AKo', 'A5s', 'A4s'],
    call: [
      'JJ', 'TT', '99', '88', '77', '66', '55',
      'AQs', 'AQo', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s',
      'AJo', 'KQo',
    ],
  }),

  // BB против лимпа SB: изолейт / чек (фолда нет)
  bb_vs_limp: build({
    iso_small: BB_ISO,
    check: except(ALL_HAND_IDS, BB_ISO),
  }),

  // BB против опена SB: 3бет / колл / фолд (защита широко)
  bb_vs_raise: build({
    '3bet': BB_VS_SB_3BET,
    call: except(BB_DEF_UNIVERSE, BB_VS_SB_3BET),
  }),
}
