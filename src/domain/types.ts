// Доменные типы тренажёра диапазонов.

/** Идентификатор действия. Базовый каталог; набор зависит от категории. */
export type ActionId =
  | 'fold'
  | 'open'
  | 'raise'
  | '3bet'
  | '4bet'
  | 'call'
  | 'limp'
  | 'check'
  | 'iso_small'
  | 'iso_big'
  | 'overlimp'
  | 'limp_call'
  | 'limp_fold'

/** Описание действия: подпись и цвет (палитра FunFarm). */
export interface ActionDef {
  id: ActionId
  label: string
  color: string
}

/** Тип руки в матрице. */
export type HandType = 'pair' | 'suited' | 'offsuit'

/** Одна из 169 рук с её положением в сетке 13×13. */
export interface Hand {
  /** Канонический ID: "AA", "AKs", "AKo", "72o". */
  id: string
  type: HandType
  /** 0..12 — индекс строки в матрице (0 = ряд A). */
  row: number
  /** 0..12 — индекс столбца в матрице (0 = столбец A). */
  col: number
}

/**
 * Распределение действий в ячейке. Сумма частот = 100.
 * Отсутствующая рука трактуется как { fold: 100 }.
 */
export type Frequency = Partial<Record<ActionId, number>>

/** Матрица: ключ — ID руки, значение — распределение действий. */
export type Matrix = Record<string, Frequency>

/** Конкретный тренируемый спот. */
export interface Spot {
  id: string
  name: string
  notes?: string
  matrix: Matrix
}

/** Категория = таб в UI. */
export interface Category {
  id: string
  name: string
  /** Допустимые действия в этой категории. */
  actions: ActionId[]
  spots: Spot[]
}

/** Корневая структура данных. */
export interface RangesData {
  version: number
  categories: Category[]
}
