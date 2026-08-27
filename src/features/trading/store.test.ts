import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTradingStore } from './store'

describe('demo simulation lifecycle', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-24T10:00:00Z'))
    useTradingStore.getState().resetDemo()
  })

  it('reserves the amount and unlocks the first achievement', () => {
    useTradingStore.getState().openTrade('up')
    const state = useTradingStore.getState()

    expect(state.activeTrade).not.toBeNull()
    expect(state.balance).toBe(9_900)
    expect(state.unlocked['first-trade']).toBeTypeOf('number')
    expect(state.score).toBe(60)
  })

  it('opens a random simulation from the lucky button', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.99)
    useTradingStore.getState().openRandomTrade()
    const state = useTradingStore.getState()

    expect(state.activeTrade).not.toBeNull()
    expect(state.activeTrade!.assetId).toBe('ETHUSD')
    expect(state.activeTrade!.duration).toBe(10)
    expect(state.activeTrade!.direction).toBe('down')
    expect(state.activeTrade!.amount).toBe(500)
    expect(state.balance).toBe(9_500)
    expect(state.logs.some((log) => log.title === 'Lucky pick')).toBe(true)

    useTradingStore.getState().openRandomTrade()
    expect(useTradingStore.getState().activeTrade).toBe(state.activeTrade)
    random.mockRestore()
  })

  it('picks the first dataset, five seconds, and Higher on a low random roll', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.1)
    useTradingStore.getState().openRandomTrade()
    const trade = useTradingStore.getState().activeTrade!

    expect(trade.assetId).toBe('BTCUSD')
    expect(trade.duration).toBe(5)
    expect(trade.direction).toBe('up')
    expect(trade.amount).toBe(60)
    random.mockRestore()
  })

  it('caps the random amount at the available balance', () => {
    useTradingStore.setState({ balance: 30 })
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.99)
    useTradingStore.getState().openRandomTrade()
    const state = useTradingStore.getState()

    expect(state.activeTrade!.amount).toBe(30)
    expect(state.balance).toBe(0)
    random.mockRestore()
  })

  it('does not open a random simulation when the balance is below the minimum', () => {
    useTradingStore.setState({ balance: 5 })
    useTradingStore.getState().openRandomTrade()
    const state = useTradingStore.getState()

    expect(state.activeTrade).toBeNull()
    expect(state.balance).toBe(5)
    expect(state.logs.some((log) => log.title === 'Lucky pick')).toBe(false)
  })

  it('unlocks the onboarding achievement only once', () => {
    useTradingStore.getState().completeOnboarding()

    const completed = useTradingStore.getState()
    expect(completed.onboardingCompleted).toBe(true)
    expect(completed.progress['welcome-aboard']).toBe(1)
    expect(completed.unlocked['welcome-aboard']).toBeTypeOf('number')
    expect(completed.score).toBe(50)

    useTradingStore.getState().completeOnboarding()
    expect(useTradingStore.getState().score).toBe(50)
  })

  it('completes a 5-second simulation and awards userscore once', () => {
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

  it('counts one visit per day and unlocks a streak on day three', () => {
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

  it('resets the current streak after a missed day', () => {
    useTradingStore.getState().registerVisit()
    vi.setSystemTime(new Date('2026-07-26T10:00:00Z'))
    useTradingStore.getState().registerVisit()

    expect(useTradingStore.getState().visitStreak).toBe(1)
    expect(useTradingStore.getState().progress['three-day-streak']).toBe(1)
  })

  it('unlocks achievements for the Help Center and full tour', () => {
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

  it('rewards the daily challenge and resets it the next day', () => {
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

  it('awards an item after 5 successful simulations and keeps it next month', () => {
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
