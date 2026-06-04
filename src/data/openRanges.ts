import type { Matrix } from '../domain/types'
import data from './extracted/open.json'

/**
 * Открывающие диапазоны (RFI) — извлечены попиксельно с чарта FunFarm (open-range.png).
 * Частоты соответствуют долям заливки клеток. Источник: src/data/extracted/open.json.
 */
export const OPEN_RANGES = data as Record<string, Matrix>
