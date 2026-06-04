import { describe, it, expect } from 'vitest'
import { ALL_HANDS, ALL_HAND_IDS, handAt } from './hands'

describe('hand generation', () => {
  it('generates exactly 169 hands', () => {
    expect(ALL_HANDS).toHaveLength(169)
  })

  it('has 169 unique ids', () => {
    expect(new Set(ALL_HAND_IDS).size).toBe(169)
  })

  it('produces 13 pairs, 78 suited, 78 offsuit', () => {
    const byType = { pair: 0, suited: 0, offsuit: 0 }
    for (const h of ALL_HANDS) byType[h.type]++
    expect(byType).toEqual({ pair: 13, suited: 78, offsuit: 78 })
  })

  it('places canonical hands correctly', () => {
    expect(handAt(0, 0).id).toBe('AA')
    expect(handAt(12, 12).id).toBe('22')
    expect(handAt(0, 1).id).toBe('AKs') // верх-право = suited
    expect(handAt(1, 0).id).toBe('AKo') // низ-лево = offsuit
    expect(handAt(12, 0).id).toBe('A2o')
    expect(handAt(0, 12).id).toBe('A2s')
  })
})
