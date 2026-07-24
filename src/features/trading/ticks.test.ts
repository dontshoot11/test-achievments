import { describe, expect, it } from 'vitest'
import { createHistory, createNextTick, nextRandom } from './ticks'

describe('value generator', () => {
  it('repeats the sequence for the same seed', () => {
    expect(nextRandom(42)).toEqual(nextRandom(42))
  })

  it('creates a separate history with the requested length', () => {
    const bitcoin = createHistory('BTCUSD', 12)
    const ethereum = createHistory('ETHUSD', 12)

    expect(bitcoin).toHaveLength(12)
    expect(ethereum).toHaveLength(12)
    expect(bitcoin[0].value).not.toBe(ethereum[0].value)
  })

  it('creates the next update with a new value and seed', () => {
    const result = createNextTick('BTCUSD', { time: 1, value: 67_420 }, 123, 2_000)

    expect(result.seed).not.toBe(123)
    expect(result.tick.time).toBe(2)
    expect(result.tick.value).toBeGreaterThan(0)
  })
})
