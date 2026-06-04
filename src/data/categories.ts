import type { Category } from '../domain/types'
import { OPEN_RANGES } from './openRanges'
import { VPIP_RANGES } from './vpipRanges'
import { BBDEF_RANGES } from './bbdefRanges'
import { BVB_RANGES } from './bvbRanges'
import { ISO_RANGES } from './isoRanges'

/**
 * Стартовые данные. Все категории заполнены ЧЕРНОВЫМИ ренджами
 * (теория + структура чартов FunFarm). Точные руки/частоты — сверить и поправить в редакторе.
 */
export const SEED_CATEGORIES: Category[] = [
  {
    id: 'open',
    name: 'Открытие (RFI)',
    actions: ['open', 'fold'],
    spots: [
      { id: 'ep', name: 'EP', notes: 'RFI ~17% (GTO). Извлечено с чарта FunFarm.', matrix: OPEN_RANGES.ep },
      { id: 'mp', name: 'MP', notes: 'RFI ~19% (GTO).', matrix: OPEN_RANGES.mp },
      { id: 'hj', name: 'HJ', notes: 'RFI ~28% (GTO).', matrix: OPEN_RANGES.hj },
      { id: 'co', name: 'CO', notes: 'RFI ~38% (GTO).', matrix: OPEN_RANGES.co },
      { id: 'btn', name: 'BTN', notes: 'RFI ~54% (GTO).', matrix: OPEN_RANGES.btn },
      { id: 'sb', name: 'SB', notes: 'SB-опен см. в категории Blind vs Blind (Игра на SB).', matrix: {} },
    ],
  },
  {
    id: 'vpip_vs_1r',
    name: 'VPIP vs 1 raiser',
    actions: ['3bet', 'call', 'fold'],
    spots: [
      { id: 'vs_ep', name: 'vsEP', notes: '3бет ~7 / колл ~11. Извлечено с чарта.', matrix: VPIP_RANGES.vs_ep },
      { id: 'vs_mp', name: 'vsMP', notes: '3бет ~8 / колл ~11.', matrix: VPIP_RANGES.vs_mp },
      { id: 'vs_hj', name: 'vsHJ', notes: '3бет ~9 / колл ~12.', matrix: VPIP_RANGES.vs_hj },
      { id: 'vs_co', name: 'vsCO', notes: '3бет ~11 / колл ~14.', matrix: VPIP_RANGES.vs_co },
      { id: 'vs_btn', name: 'vsBTN', notes: '3бет ~12 / колл ~16.', matrix: VPIP_RANGES.vs_btn },
    ],
  },
  {
    id: 'bb_def',
    name: 'BB defense',
    actions: ['3bet', 'call', 'fold'],
    spots: [
      // Позиция открывшего × сайзинг опенрейза (2.0 / 2.5 / 3.0 bb). Извлечено с чарта FunFarm.
      { id: 'vs_ep_20', name: 'vsEP 2.0', matrix: BBDEF_RANGES.vs_ep_20 },
      { id: 'vs_ep_25', name: 'vsEP 2.5', matrix: BBDEF_RANGES.vs_ep_25 },
      { id: 'vs_ep_30', name: 'vsEP 3.0', matrix: BBDEF_RANGES.vs_ep_30 },
      { id: 'vs_mp_20', name: 'vsMP 2.0', matrix: BBDEF_RANGES.vs_mp_20 },
      { id: 'vs_mp_25', name: 'vsMP 2.5', matrix: BBDEF_RANGES.vs_mp_25 },
      { id: 'vs_mp_30', name: 'vsMP 3.0', matrix: BBDEF_RANGES.vs_mp_30 },
      { id: 'vs_hj_20', name: 'vsHJ 2.0', matrix: BBDEF_RANGES.vs_hj_20 },
      { id: 'vs_hj_25', name: 'vsHJ 2.5', matrix: BBDEF_RANGES.vs_hj_25 },
      { id: 'vs_hj_30', name: 'vsHJ 3.0', matrix: BBDEF_RANGES.vs_hj_30 },
      { id: 'vs_co_20', name: 'vsCO 2.0', matrix: BBDEF_RANGES.vs_co_20 },
      { id: 'vs_co_25', name: 'vsCO 2.5', matrix: BBDEF_RANGES.vs_co_25 },
      { id: 'vs_co_30', name: 'vsCO 3.0', matrix: BBDEF_RANGES.vs_co_30 },
      { id: 'vs_btn_20', name: 'vsBTN 2.0', matrix: BBDEF_RANGES.vs_btn_20 },
      { id: 'vs_btn_25', name: 'vsBTN 2.5', matrix: BBDEF_RANGES.vs_btn_25 },
      { id: 'vs_btn_30', name: 'vsBTN 3.0', matrix: BBDEF_RANGES.vs_btn_30 },
    ],
  },
  {
    id: 'bvb',
    name: 'Blind vs Blind',
    actions: ['raise', 'limp', '3bet', '4bet', 'call', 'iso_small', 'check', 'fold'],
    spots: [
      { id: 'sb_vpip', name: 'SB VPIP', notes: 'VPIP 100%: рейз ~50% / лимп ~50%, фолда нет. Извлечено с чарта.', matrix: BVB_RANGES.sb_vpip },
      { id: 'sb_vs_3bet', name: 'SB vs 3bet', notes: 'Fold65 / Call27 / 4bet8.', matrix: BVB_RANGES.sb_vs_3bet },
      { id: 'bb_vs_limp', name: 'BB vs limp', notes: 'ISO ~70%+ / чек, фолда нет.', matrix: BVB_RANGES.bb_vs_limp },
      { id: 'bb_vs_raise', name: 'BB vs raise', notes: 'Fold35 / Call60 / 3bet5.', matrix: BVB_RANGES.bb_vs_raise },
    ],
  },
  {
    id: 'iso_vs_fish',
    name: 'ISO vs Fish',
    actions: ['iso_small', 'iso_big', 'overlimp', 'fold'],
    spots: [
      { id: 'ep', name: 'EP', notes: 'ISO ~14%. Извлечено с чарта.', matrix: ISO_RANGES.ep },
      { id: 'mp', name: 'MP', notes: 'ISO ~19%.', matrix: ISO_RANGES.mp },
      { id: 'hj', name: 'HJ', notes: 'ISO ~23%.', matrix: ISO_RANGES.hj },
      { id: 'co', name: 'CO', notes: 'ISO ~27%.', matrix: ISO_RANGES.co },
      { id: 'btn', name: 'BTN', notes: 'ISO ~37%.', matrix: ISO_RANGES.btn },
      { id: 'blinds', name: 'SB+BB', notes: 'ISO ~19%.', matrix: ISO_RANGES.blinds },
    ],
  },
]
