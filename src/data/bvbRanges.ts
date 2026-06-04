import type { Matrix } from '../domain/types'
import data from './extracted/bvb.json'

/** Blind vs Blind — извлечено с чарта FunFarm. */
export const BVB_RANGES = data as Record<string, Matrix>
