import { describe, expect, it } from 'vitest'
import { createHistory, createNextTick, nextRandom } from './ticks'

describe('генератор тиков', () => {
  it('повторяет последовательность для одинакового seed', () => {
    expect(nextRandom(42)).toEqual(nextRandom(42))
  })

  it('создаёт отдельную историю нужной длины', () => {
    const bitcoin = createHistory('BTCUSD', 12)
    const ethereum = createHistory('ETHUSD', 12)

    expect(bitcoin).toHaveLength(12)
    expect(ethereum).toHaveLength(12)
    expect(bitcoin[0].value).not.toBe(ethereum[0].value)
  })

  it('создаёт следующий тик с новой ценой и seed', () => {
    const result = createNextTick('BTCUSD', { time: 1, value: 67_420 }, 123, 2_000)

    expect(result.seed).not.toBe(123)
    expect(result.tick.time).toBe(2)
    expect(result.tick.value).toBeGreaterThan(0)
  })
})
