import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ActionId, Category, Frequency, Matrix, RangesData, Spot } from '../domain/types'
import { SEED_CATEGORIES } from '../data/categories'

const STORAGE_KEY = 'poker-range-trainer'
const DATA_VERSION = 1

function seedData(): RangesData {
  return { version: DATA_VERSION, categories: structuredClone(SEED_CATEGORIES) }
}

/** Иммутабельно обновляет спот в категории. */
function mapSpot(
  data: RangesData,
  catId: string,
  spotId: string,
  fn: (spot: Spot) => Spot,
): RangesData {
  return {
    ...data,
    categories: data.categories.map((c) =>
      c.id !== catId
        ? c
        : { ...c, spots: c.spots.map((s) => (s.id === spotId ? fn(s) : s)) },
    ),
  }
}

function mapCategory(data: RangesData, catId: string, fn: (c: Category) => Category): RangesData {
  return { ...data, categories: data.categories.map((c) => (c.id === catId ? fn(c) : c)) }
}

interface RangesState {
  data: RangesData

  updateCell: (catId: string, spotId: string, handId: string, freq: Frequency) => void
  setSpotMatrix: (catId: string, spotId: string, matrix: Matrix) => void
  setSpotNotes: (catId: string, spotId: string, notes: string) => void
  addSpot: (catId: string, name: string) => string
  renameSpot: (catId: string, spotId: string, name: string) => void
  deleteSpot: (catId: string, spotId: string) => void
  setCategoryActions: (catId: string, actions: ActionId[]) => void

  importData: (data: RangesData) => void
  resetToSeed: () => void
}

let spotCounter = 0

export const useRangesStore = create<RangesState>()(
  persist(
    (set) => ({
      data: seedData(),

      updateCell: (catId, spotId, handId, freq) =>
        set((st) => ({
          data: mapSpot(st.data, catId, spotId, (s) => {
            const matrix: Matrix = { ...s.matrix }
            if (Object.keys(freq).length === 0) delete matrix[handId]
            else matrix[handId] = freq
            return { ...s, matrix }
          }),
        })),

      setSpotMatrix: (catId, spotId, matrix) =>
        set((st) => ({ data: mapSpot(st.data, catId, spotId, (s) => ({ ...s, matrix })) })),

      setSpotNotes: (catId, spotId, notes) =>
        set((st) => ({ data: mapSpot(st.data, catId, spotId, (s) => ({ ...s, notes })) })),

      addSpot: (catId, name) => {
        const id = `spot-${++spotCounter}-${name.toLowerCase().replace(/\s+/g, '-')}`
        set((st) => ({
          data: mapCategory(st.data, catId, (c) => ({
            ...c,
            spots: [...c.spots, { id, name, matrix: {} }],
          })),
        }))
        return id
      },

      renameSpot: (catId, spotId, name) =>
        set((st) => ({ data: mapSpot(st.data, catId, spotId, (s) => ({ ...s, name })) })),

      deleteSpot: (catId, spotId) =>
        set((st) => ({
          data: mapCategory(st.data, catId, (c) => ({
            ...c,
            spots: c.spots.filter((s) => s.id !== spotId),
          })),
        })),

      setCategoryActions: (catId, actions) =>
        set((st) => ({ data: mapCategory(st.data, catId, (c) => ({ ...c, actions })) })),

      importData: (data) => set({ data }),
      resetToSeed: () => set({ data: seedData() }),
    }),
    {
      name: STORAGE_KEY,
      version: DATA_VERSION,
    },
  ),
)
