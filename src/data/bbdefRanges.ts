import type { Matrix } from '../domain/types'
import data from './extracted/bb_def.json'

/** BB defense — извлечено с чарта FunFarm (верхний ряд сайзингов). */
export const BBDEF_RANGES = data as Record<string, Matrix>
