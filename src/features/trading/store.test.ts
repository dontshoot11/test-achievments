import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTradingStore } from './store'

describe('жизненный цикл демо-сделки', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-24T10:00:00Z'))
    useTradingStore.getState().resetDemo()
  })

  it('резервирует сумму и открывает первую ачивку', () => {
    useTradingStore.getState().openTrade('up')
    const state = useTradingStore.getState()

    expect(state.activeTrade).not.toBeNull()
    expect(state.balance).toBe(9_900)
    expect(state.unlocked['first-trade']).toBeTypeOf('number')
    expect(state.score).toBe(60)
  })

  it('закрывает 5-секундную сделку и начисляет userscore один раз', () => {
    useTradingStore.getState().openTrade('up')
    vi.advanceTimersByTime(5_100)
    useTradingStore.getState().marketTick()
    const completed = useTradingStore.getState()

    expect(completed.activeTrade).toBeNull()
    expect(completed.trades).toHaveLength(1)
    expect(completed.unlocked['fast-trade']).toBeTypeOf('number')
    expect(completed.unlocked['score-century']).toBeTypeOf('number')

    const score = completed.score
    useTradingStore.getState().marketTick()
    expect(useTradingStore.getState().score).toBe(score)
  })

  it('считает только один заход в день и открывает серию на третий день', () => {
    useTradingStore.getState().registerVisit()
    useTradingStore.getState().registerVisit()
    expect(useTradingStore.getState().progress['three-day-streak']).toBe(1)

    vi.setSystemTime(new Date('2026-07-25T10:00:00Z'))
    useTradingStore.getState().registerVisit()
    expect(useTradingStore.getState().progress['three-day-streak']).toBe(2)

    vi.setSystemTime(new Date('2026-07-26T10:00:00Z'))
    useTradingStore.getState().registerVisit()
    expect(useTradingStore.getState().progress['three-day-streak']).toBe(3)
    expect(useTradingStore.getState().unlocked['three-day-streak']).toBeTypeOf('number')
  })

  it('сбрасывает текущую серию после пропущенного дня', () => {
    useTradingStore.getState().registerVisit()
    vi.setSystemTime(new Date('2026-07-26T10:00:00Z'))
    useTradingStore.getState().registerVisit()

    expect(useTradingStore.getState().visitStreak).toBe(1)
    expect(useTradingStore.getState().progress['three-day-streak']).toBe(1)
  })

  it('открывает ачивки за хелп-центр и полный маршрут', () => {
    const state = useTradingStore.getState()
    state.openHelpTopic('trading-basics')
    state.openHelpTopic('userscore-guide')
    state.openHelpTopic('safe-demo')
    state.completeHelp()
    state.visitPage('trade')
    state.visitPage('achievements')
    state.visitPage('help')

    const completed = useTradingStore.getState()
    expect(completed.unlocked['help-explorer']).toBeTypeOf('number')
    expect(completed.unlocked['help-reader']).toBeTypeOf('number')
    expect(completed.unlocked['full-route']).toBeTypeOf('number')
  })

  it('награждает за задание дня и сбрасывает его на следующий день', () => {
    useTradingStore.setState({
      dailyTask: {
        date: '2026-07-24',
        taskId: 'asset-hopper',
        progress: 0,
        completed: false,
        actionKeys: [],
      },
    })

    useTradingStore.getState().selectAsset('ETHUSD')
    useTradingStore.getState().selectAsset('BTCUSD')
    useTradingStore.getState().selectAsset('ETHUSD')

    const completed = useTradingStore.getState()
    expect(completed.dailyTask?.completed).toBe(true)
    expect(completed.unlocked['daily-challenge']).toBeTypeOf('number')
    expect(completed.score).toBe(75)

    vi.setSystemTime(new Date('2026-07-25T10:00:00Z'))
    useTradingStore.getState().registerVisit()
    const nextDay = useTradingStore.getState()

    expect(nextDay.dailyTask?.date).toBe('2026-07-25')
    expect(nextDay.dailyTask?.progress).toBe(0)
    expect(nextDay.unlocked['daily-challenge']).toBeUndefined()
    expect(nextDay.score).toBe(75)
  })

  it('выдаёт предмет за 5 прибыльных сделок и сохраняет его после смены месяца', () => {
    useTradingStore.setState({
      monthlyTask: {
        month: '2026-07',
        progress: 0,
        completed: false,
        rewardId: 'football-2026-07',
      },
    })

    for (let index = 0; index < 5; index += 1) {
      useTradingStore.setState({
        activeTrade: {
          id: `monthly-win-${index}`,
          assetId: 'BTCUSD',
          direction: 'up',
          amount: 10,
          duration: 5,
          openPrice: 1,
          openedAt: Date.now() - 6_000,
          expiresAt: Date.now() - 1_000,
        },
      })
      useTradingStore.getState().marketTick()
    }

    const completed = useTradingStore.getState()
    expect(completed.monthlyTask?.progress).toBe(5)
    expect(completed.unlocked['monthly-challenge']).toBeTypeOf('number')
    expect(completed.ownedCosmetics).toContain('football-2026-07')
    expect(completed.selectedCosmetic).toBe('football-2026-07')

    completed.selectCosmetic(null)
    expect(useTradingStore.getState().selectedCosmetic).toBeNull()
    useTradingStore.getState().selectCosmetic('football-2026-07')
    expect(useTradingStore.getState().selectedCosmetic).toBe('football-2026-07')

    vi.setSystemTime(new Date('2026-08-01T10:00:00Z'))
    useTradingStore.getState().registerVisit()
    const nextMonth = useTradingStore.getState()

    expect(nextMonth.monthlyTask?.month).toBe('2026-08')
    expect(nextMonth.monthlyTask?.progress).toBe(0)
    expect(nextMonth.unlocked['monthly-challenge']).toBeUndefined()
    expect(nextMonth.ownedCosmetics).toContain('football-2026-07')
  })
})
