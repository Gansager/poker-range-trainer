import { describe, it, expect } from 'vitest'
import { SEED_CATEGORIES } from './categories'
import type { ActionId } from '../domain/types'

function combos(id: string): number {
  if (id.length === 2) return 6 // пара
  if (id.endsWith('s')) return 4
  return 12
}

describe('seed data summary (combo % per action)', () => {
  it('prints breakdown and validates frequencies', () => {
    const lines: string[] = []
    for (const cat of SEED_CATEGORIES) {
      for (const spot of cat.spots) {
        const byAction: Partial<Record<ActionId, number>> = {}
        for (const [handId, freq] of Object.entries(spot.matrix)) {
          // сумма частот в ячейке не должна превышать 100
          const sum = Object.values(freq).reduce((s, p) => s + (p ?? 0), 0)
          expect(sum, `${cat.id}/${spot.id}/${handId} сумма=${sum}`).toBeLessThanOrEqual(100)
          for (const [a, p] of Object.entries(freq)) {
            byAction[a as ActionId] = (byAction[a as ActionId] ?? 0) + (combos(handId) * (p ?? 0)) / 100
          }
        }
        const pct = Object.entries(byAction)
          .map(([a, c]) => `${a} ${Math.round((c / 1326) * 100)}%`)
          .join(', ')
        if (pct) lines.push(`${cat.name} / ${spot.name}: ${pct}`)
      }
    }
    console.log('\n' + lines.join('\n'))
  })
})
