import { build, except } from './buildMatrix'

/**
 * ISO против 1 лимпера-любителя. Действия: изолейт 3.5bb / изолейт 5bb+ / оверлимп / фолд.
 * Черновик по теории + структуре чарта FunFarm. Целевая ширина изолейта (с шапки):
 * EP ~14, MP ~19, HJ ~23, CO ~27, BTN ~37, SB+BB ~19.
 * Сильнейшие руки — большим сайзом (iso_big); спекулятивные пары — оверлимп.
 */

// Сильнейшие руки изолируем увеличенным сайзом (5bb+)
const BIG = ['QQ', 'KK', 'AA', 'AKs', 'AKo']

const EP_RAISE = [
  '77', '88', '99', 'TT', 'JJ', 'QQ', 'KK', 'AA',
  'AQs', 'AJs', 'ATs', 'A5s', 'A4s', 'AKs',
  'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s',
  'AQo', 'AKo', 'KQo',
]
const MP_RAISE = [
  ...EP_RAISE, '66', '55',
  'A9s', 'A8s', 'QTs', 'J9s', 'T8s', '97s', '87s', '76s',
  'AJo', 'KJo', 'QJo',
]
const HJ_RAISE = [
  ...MP_RAISE, '44', '33', '22',
  'A7s', 'A6s', 'K9s', 'Q9s', 'J8s', 'T7s', '86s', '75s', '65s', '54s',
  'ATo', 'KTo', 'QTo', 'JTo',
]
const CO_RAISE = [
  ...HJ_RAISE,
  'A2s', 'A3s', 'K7s', 'K8s', 'Q8s', 'J7s', 'T6s', '96s', '85s', '64s', '53s',
  'A8o', 'A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '98o',
]
const BTN_RAISE = [
  ...CO_RAISE,
  'K2s', 'K3s', 'K4s', 'K5s', 'K6s', 'Q5s', 'Q6s', 'Q7s', 'J6s', 'T5s', '95s', '84s', '74s', '63s', '43s',
  'A2o', 'A3o', 'A4o', 'A5o', 'A6o', 'A7o', 'K7o', 'K8o', 'Q8o', 'J8o', 'T8o', '87o', '76o', '65o',
]
// SB+BB vs лимп — ширина около MP/HJ
const BLINDS_RAISE = HJ_RAISE

function iso(raise: string[], overlimp: string[] = []) {
  const small = except(raise, BIG)
  const big = raise.filter((h) => BIG.includes(h))
  return build({ iso_big: big, iso_small: small, overlimp })
}

export const ISO_RANGES = {
  ep: iso(EP_RAISE, ['22', '33', '44', '55', '66']),
  mp: iso(MP_RAISE, ['22', '33', '44']),
  hj: iso(HJ_RAISE),
  co: iso(CO_RAISE),
  btn: iso(BTN_RAISE),
  blinds: iso(BLINDS_RAISE),
}
