import { describe, expect, it } from 'vitest'
import { getLevel, getNextLevel } from './config'

describe('уровни userscore', () => {
  it.each([
    [0, 'Новичок'],
    [100, 'Трейдер'],
    [250, 'Про'],
    [500, 'Эксперт'],
    [900, 'Гуру'],
  ])('возвращает правильный уровень для %i', (score, name) => {
    expect(getLevel(score).name).toBe(name)
  })

  it('возвращает следующую ступень и завершает прогрессию на Гуру', () => {
    expect(getNextLevel(99)?.name).toBe('Трейдер')
    expect(getNextLevel(900)).toBeUndefined()
  })
})
