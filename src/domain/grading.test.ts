import { describe, it, expect } from 'vitest'
import { gradeModeA, gradeModeB, dominantAction } from './grading'
import type { Matrix } from './types'

describe('dominantAction', () => {
  it('returns fold for empty/undefined', () => {
    expect(dominantAction(undefined)).toBe('fold')
    expect(dominantAction({})).toBe('fold')
    expect(dominantAction({ fold: 100 })).toBe('fold')
  })
  it('returns highest non-fold action', () => {
    expect(dominantAction({ '3bet': 35, call: 65 })).toBe('call')
    expect(dominantAction({ open: 100 })).toBe('open')
  })
})

describe('gradeModeA', () => {
  const ref: Matrix = {
    AA: { '3bet': 100 },
    A5s: { '3bet': 35, call: 65 }, // смешанная — верны и 3bet, и call
    KQs: { call: 100 },
    // 72o отсутствует → fold
  }

  it('counts correct pure hand', () => {
    const ans: Matrix = { AA: { '3bet': 100 } }
    const r = gradeModeA(ans, ref)
    expect(r.byHand.AA).toBe('correct')
  })

  it('accepts either action on a mixed hand', () => {
    expect(gradeModeA({ A5s: { '3bet': 100 } }, ref).byHand.A5s).toBe('correct')
    expect(gradeModeA({ A5s: { call: 100 } }, ref).byHand.A5s).toBe('correct')
  })

  it('flags wrong action', () => {
    expect(gradeModeA({ KQs: { '3bet': 100 } }, ref).byHand.KQs).toBe('wrong')
  })

  it('flags missed (left fold where ref plays)', () => {
    expect(gradeModeA({}, ref).byHand.AA).toBe('missed')
  })

  it('flags extra (played where ref folds)', () => {
    expect(gradeModeA({ '72o': { '3bet': 100 } }, ref).byHand['72o']).toBe('extra')
  })

  it('fold/fold is neutral, not a mistake', () => {
    const r = gradeModeA({}, {})
    expect(r.mistakes).toHaveLength(0)
    expect(r.accuracy).toBe(100)
  })

  it('computes accuracy over relevant hands', () => {
    // perfect answer for ref → 100%
    const perfect: Matrix = { AA: { '3bet': 100 }, A5s: { call: 100 }, KQs: { call: 100 } }
    expect(gradeModeA(perfect, ref).accuracy).toBe(100)
  })
})

describe('gradeModeB (exact frequencies)', () => {
  const ref: Matrix = {
    AA: { '3bet': 100 },
    A5s: { '3bet': 35, call: 65 },
    KQs: { call: 100 },
  }

  it('correct within tolerance', () => {
    const ans: Matrix = { AA: { '3bet': 100 }, A5s: { '3bet': 40, call: 60 }, KQs: { call: 100 } }
    const r = gradeModeB(ans, ref, 10)
    expect(r.byHand.A5s).toBe('correct') // diff 5 ≤ 10
    expect(r.accuracy).toBe(100)
  })

  it('wrong when a frequency is outside tolerance', () => {
    const ans: Matrix = { A5s: { '3bet': 60, call: 40 } } // diff 25 > 10
    expect(gradeModeB(ans, ref, 10).byHand.A5s).toBe('wrong')
  })

  it('missed and extra still detected', () => {
    expect(gradeModeB({}, ref).byHand.AA).toBe('missed')
    expect(gradeModeB({ '72o': { '3bet': 100 } }, ref).byHand['72o']).toBe('extra')
  })
})
