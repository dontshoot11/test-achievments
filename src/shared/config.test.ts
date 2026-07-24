import { describe, expect, it } from 'vitest'
import { getLevel, getNextLevel } from './config'

describe('userscore levels', () => {
  it.each([
    [0, 'Beginner'],
    [100, 'Explorer'],
    [250, 'Advanced'],
    [500, 'Expert'],
    [900, 'Master'],
  ])('returns the correct level for %i', (score, name) => {
    expect(getLevel(score).name).toBe(name)
  })

  it('returns the next level and ends progression at Master', () => {
    expect(getNextLevel(99)?.name).toBe('Explorer')
    expect(getNextLevel(900)).toBeUndefined()
  })
})
