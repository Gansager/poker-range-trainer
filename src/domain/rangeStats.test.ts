import { describe, it, expect } from 'vitest'
import { rangeStats, comboWeight } from './rangeStats'
import type { Matrix } from './types'

describe('comboWeight', () => {
  it('pair=6, suited=4, offsuit=12', () => {
    expect(comboWeight('AA')).toBe(6)
    expect(comboWeight('AKs')).toBe(4)
    expect(comboWeight('AKo')).toBe(12)
  })
})

describe('rangeStats', () => {
  it('empty range = 0%', () => {
    expect(rangeStats({}).total).toBe(0)
  })

  it('single pure pair = 6/1326', () => {
    const m: Matrix = { AA: { '3bet': 100 } }
    const s = rangeStats(m)
    expect(s.combos).toBe(6)
    expect(s.total).toBeCloseTo(0.5, 1)
    expect(s.byAction['3bet']).toBeCloseTo(0.5, 1)
  })

  it('splits combos across actions by frequency', () => {
    const m: Matrix = { AKo: { '3bet': 50, call: 50 } } // 12 combo → 6/6
    const s = rangeStats(m)
    expect(s.byAction['3bet']).toBeCloseTo(0.45, 1)
    expect(s.byAction['call']).toBeCloseTo(0.45, 1)
    expect(s.total).toBeCloseTo(0.9, 1)
  })

  it('partial frequency counts proportionally', () => {
    const m: Matrix = { AA: { open: 50 } } // 3 combo
    expect(rangeStats(m).combos).toBe(3)
  })
})
