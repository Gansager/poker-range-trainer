import type { Matrix } from '../domain/types'
import data from './extracted/iso_vs_fish.json'

/** ISO vs Fish — извлечено с чарта FunFarm (верхний ряд позиций). */
export const ISO_RANGES = data as Record<string, Matrix>
