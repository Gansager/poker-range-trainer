import type { Matrix } from '../domain/types'
import data from './extracted/vpip_vs_1r.json'

/** VPIP vs 1 raiser — извлечено с чарта FunFarm (нижний ряд BTN/SB). */
export const VPIP_RANGES = data as Record<string, Matrix>
