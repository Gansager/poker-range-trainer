import { describe, it, expect } from 'vitest'
import { OPEN_RANGES } from './openRanges'
import type { Matrix } from '../domain/types'

/** % комбинаций от 1326: пара=6, suited=4, offsuit=12. */
function comboPct(matrix: Matrix): number {
  let combos = 0
  for (const id of Object.keys(matrix)) {
    if (id.length === 2) combos += 6 // пара
    else if (id.endsWith('s')) combos += 4
    else combos += 12
  }
  return Math.round((combos / 1326) * 1000) / 10
}

describe('open ranges — combo %', () => {
  it('prints and bounds each position', () => {
    const pct = {
      EP: comboPct(OPEN_RANGES.ep),
      MP: comboPct(OPEN_RANGES.mp),
      HJ: comboPct(OPEN_RANGES.hj),
      CO: comboPct(OPEN_RANGES.co),
      BTN: comboPct(OPEN_RANGES.btn),
    }
    console.log('RFI combo %:', pct)
    // прогрессивность: EP < MP < HJ < CO < BTN
    expect(pct.EP).toBeLessThan(pct.MP)
    expect(pct.MP).toBeLessThan(pct.HJ)
    expect(pct.HJ).toBeLessThan(pct.CO)
    expect(pct.CO).toBeLessThan(pct.BTN)
  })
})
