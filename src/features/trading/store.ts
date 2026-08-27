/**
 * Central demo store: datasets, simulations, balance, userscore, achievements,
 * challenges, and the activity log, persisted to localStorage.
 *
 * Read it with `useTradingStore(selector)` and mutate only through its actions —
 * they keep logs, achievements, and challenge progress in sync.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ACHIEVEMENTS,
  ASSETS,
  COSMETICS,
  getDailyTask,
  getLevel,
  getMonthlyCosmetic,
} from '../../shared/config'
import type {
  AssetId,
  DailyTaskKind,
  DailyTaskState,
  Direction,
  EventType,
  LogEvent,
  MonthlyTaskState,
  Tick,
  Trade,
  TradeDuration,
} from '../../shared/types'
import { createHistory, createNextTick } from './ticks'

interface TradingState {
  selectedAsset: AssetId
  amount: number
  duration: TradeDuration
  balance: number
  score: number
  histories: Record<AssetId, Tick[]>
  seeds: Record<AssetId, number>
  activeTrade: Trade | null
  randomTradeDraft: Pick<Trade, 'amount' | 'duration' | 'direction'> | null
  lastResult: Trade | null
  trades: Trade[]
  logs: LogEvent[]
  unlocked: Record<string, number>
  progress: Record<string, number>
  tradedAssets: AssetId[]
  winStreak: number
  assetSwitches: number
  visitDates: string[]
  visitStreak: number
  helpTopics: string[]
  visitedPages: string[]
  dailyTask: DailyTaskState | null
  monthlyTask: MonthlyTaskState | null
  ownedCosmetics: string[]
  selectedCosmetic: string | null
  onboardingCompleted: boolean
  toast: string | null
  registerVisit: () => void
  visitPage: (page: string) => void
  openHelpTopic: (topic: string) => void
  completeHelp: () => void
  selectCosmetic: (cosmeticId: string | null) => void
  selectAsset: (asset: AssetId) => void
  setAmount: (amount: number) => void
  setDuration: (duration: TradeDuration) => void
  openTrade: (direction: Direction) => void
  prepareRandomTrade: () => void
  confirmRandomTrade: () => void
  updateRandomTradeDraft: (draft: Partial<Pick<Trade, 'amount' | 'duration' | 'direction'>>) => void
  dismissRandomTrade: () => void
  dismissTradeResult: () => void
  marketTick: () => void
  clearLogs: () => void
  clearToast: () => void
  completeOnboarding: () => void
  resetDemo: () => void
  boostDemo: () => void
}

const initialHistories = () => ({
  BTCUSD: createHistory('BTCUSD'),
  ETHUSD: createHistory('ETHUSD'),
})

const makeLog = (type: EventType, title: string, detail: string): LogEvent => ({
  id: crypto.randomUUID(),
  type,
  title,
  detail,
  timestamp: Date.now(),
})

const appendLog = (logs: LogEvent[], log: LogEvent) => [...logs, log].slice(-160)

const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getLocalMonthKey = (date = new Date()) => getLocalDateKey(date).slice(0, 7)

const baseState = () => ({
  selectedAsset: 'BTCUSD' as AssetId,
  amount: 100,
  duration: 5 as TradeDuration,
  balance: 10_000,
  score: 0,
  histories: initialHistories(),
  seeds: { BTCUSD: 72_941, ETHUSD: 31_337 },
  activeTrade: null,
  randomTradeDraft: null as Pick<Trade, 'amount' | 'duration' | 'direction'> | null,
  lastResult: null as Trade | null,
  trades: [] as Trade[],
  logs: [
    makeLog(
      'system',
      'Demo started',
      'The value generator is running with a fixed seed',
    ),
  ],
  unlocked: {} as Record<string, number>,
  progress: {} as Record<string, number>,
  tradedAssets: [] as AssetId[],
  winStreak: 0,
  assetSwitches: 0,
  visitDates: [] as string[],
  visitStreak: 0,
  helpTopics: [] as string[],
  visitedPages: [] as string[],
  dailyTask: null as DailyTaskState | null,
  monthlyTask: null as MonthlyTaskState | null,
  ownedCosmetics: [] as string[],
  selectedCosmetic: null as string | null,
  onboardingCompleted: false,
  toast: null as string | null,
})

type MutableSnapshot = Pick<TradingState, 'unlocked' | 'score' | 'logs' | 'toast'>

const unlock = (state: MutableSnapshot, ids: string[]) => {
  const unlocked = { ...state.unlocked }
  let score = state.score
  let logs = state.logs
  const messages: string[] = []

  for (const id of ids) {
    if (unlocked[id]) continue
    const achievement = ACHIEVEMENTS.find((item) => item.id === id)
    if (!achievement) continue
    unlocked[id] = Date.now()
    score += achievement.reward
    messages.push(`${achievement.title} · +${achievement.reward}`)
    logs = appendLog(
      logs,
      makeLog('achievement', `Achievement: ${achievement.title}`, `+${achievement.reward} userscore`),
    )
  }

  if (score >= 100 && !unlocked['score-century']) {
    const century = ACHIEVEMENTS.find((item) => item.id === 'score-century')!
    unlocked['score-century'] = Date.now()
    score += century.reward
    messages.push(`${century.title} · +${century.reward}`)
    logs = appendLog(
      logs,
      makeLog('achievement', `Achievement: ${century.title}`, `+${century.reward} userscore`),
    )
  }

  const previousLevel = getLevel(state.score)
  const nextLevel = getLevel(score)
  if (nextLevel.id > previousLevel.id) {
    logs = appendLog(
      logs,
      makeLog('progression', `New level: ${nextLevel.name}`, 'Profile avatar updated'),
    )
    messages.push(`${nextLevel.name} level unlocked`)
  }

  return {
    unlocked,
    score,
    logs,
    toast: messages.length ? messages.join(' • ') : state.toast,
  }
}

const advanceDailyTask = <T extends TradingState>(
  state: T,
  kind: DailyTaskKind,
  actionKey?: string,
): T => {
  const daily = state.dailyTask
  if (!daily || daily.date !== getLocalDateKey() || daily.completed) return state
  const definition = getDailyTask(daily.date)
  if (definition.kind !== kind || (actionKey && daily.actionKeys.includes(actionKey))) return state

  const progress = Math.min(daily.progress + 1, definition.target)
  const completed = progress >= definition.target
  const next = {
    ...state,
    dailyTask: {
      ...daily,
      progress,
      completed,
      actionKeys: actionKey ? [...daily.actionKeys, actionKey] : daily.actionKeys,
    },
    progress: {
      ...state.progress,
      'daily-challenge': completed ? 1 : 0,
    },
    logs: appendLog(
      state.logs,
      makeLog(
        completed ? 'achievement' : 'progression',
        completed ? 'Daily challenge completed' : 'Daily challenge progress',
        `${definition.title} · ${progress}/${definition.target}`,
      ),
    ),
  } as T

  return completed
    ? { ...next, ...unlock(next, ['daily-challenge']) }
    : next
}

const advanceMonthlyTask = <T extends TradingState>(state: T): T => {
  const monthly = state.monthlyTask
  if (!monthly || monthly.month !== getLocalMonthKey() || monthly.completed) return state

  const progress = Math.min(monthly.progress + 1, 5)
  const completed = progress >= 5
  const reward = getMonthlyCosmetic(monthly.month)
  const next = {
    ...state,
    monthlyTask: { ...monthly, progress, completed },
    ownedCosmetics: completed
      ? Array.from(new Set([...state.ownedCosmetics, reward.id]))
      : state.ownedCosmetics,
    selectedCosmetic: completed ? reward.id : state.selectedCosmetic,
    progress: { ...state.progress, 'monthly-challenge': progress },
    logs: appendLog(
      state.logs,
      makeLog(
        completed ? 'achievement' : 'progression',
        completed ? 'Monthly challenge completed' : 'Monthly challenge progress',
        completed
          ? `${reward.name} added to your collection`
          : `Successful simulations · ${progress}/5`,
      ),
    ),
  } as T

  return completed
    ? { ...next, ...unlock(next, ['monthly-challenge']) }
    : next
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      ...baseState(),
      selectAsset: (asset) =>
        set((state) => {
          if (asset === state.selectedAsset) return state
          const switches = state.assetSwitches + 1
          const next = {
            ...state,
            selectedAsset: asset,
            assetSwitches: switches,
            progress: { ...state.progress, 'curious-clicker': Math.min(switches, 5) },
            logs: appendLog(
              state.logs,
              makeLog('setting', 'Dataset changed', `${ASSETS[state.selectedAsset].symbol} → ${ASSETS[asset].symbol}`),
            ),
          }
          const withDailyProgress = advanceDailyTask(next, 'switch-assets')
          return switches >= 5
            ? { ...withDailyProgress, ...unlock(withDailyProgress, ['curious-clicker']) }
            : withDailyProgress
        }),
      setAmount: (amount) =>
        set((state) => ({
          amount,
          logs: appendLog(
            state.logs,
            makeLog('setting', 'Amount changed', `$${state.amount} → $${amount}`),
          ),
        })),
      setDuration: (duration) =>
        set((state) => ({
          duration,
          logs: appendLog(
            state.logs,
            makeLog('setting', 'Duration changed', `${state.duration}s → ${duration}s`),
          ),
        })),
      openTrade: (direction) =>
        set((state) => {
          if (state.activeTrade || state.amount > state.balance || state.amount < 10) return state
          const history = state.histories[state.selectedAsset]
          const price = history.at(-1)!.value
          const now = Date.now()
          const trade: Trade = {
            id: crypto.randomUUID(),
            assetId: state.selectedAsset,
            direction,
            amount: state.amount,
            duration: state.duration,
            openPrice: price,
            openedAt: now,
            expiresAt: now + state.duration * 1000,
          }
          const tradedAssets = Array.from(new Set([...state.tradedAssets, state.selectedAsset]))
          const progress = {
            ...state.progress,
            'first-trade': 1,
            'big-trade': state.amount >= 250 ? 1 : (state.progress['big-trade'] ?? 0),
            'market-explorer': tradedAssets.length,
          }
          const ids = [
            'first-trade',
            ...(state.amount >= 250 ? ['big-trade'] : []),
            ...(tradedAssets.length === 2 ? ['market-explorer'] : []),
          ]
          const next = {
            ...state,
            activeTrade: trade,
            balance: state.balance - state.amount,
            tradedAssets,
            progress,
            logs: appendLog(
              appendLog(
                state.logs,
                makeLog(
                  'trade',
                  `Simulation started · ${direction === 'up' ? 'Higher' : 'Lower'}`,
                  `${ASSETS[state.selectedAsset].symbol} · $${state.amount} · ${state.duration}s · ${price}`,
                ),
              ),
              makeLog('balance', 'Amount reserved', `Balance −$${state.amount}`),
            ),
          }
          const withAchievements = { ...next, ...unlock(next, ids) }
          return state.amount >= 250
            ? advanceDailyTask(withAchievements, 'large-trade')
            : withAchievements
        }),
      prepareRandomTrade: () => {
        const state = get()
        if (state.activeTrade || state.randomTradeDraft) return
        const maxAmount = Math.min(500, Math.floor(state.balance / 10) * 10)
        if (maxAmount < 10) return

        const durations: TradeDuration[] = [5, 10]
        const duration = durations[Math.floor(Math.random() * durations.length)]
        const direction: Direction = Math.random() < 0.5 ? 'up' : 'down'
        const amount = (Math.floor(Math.random() * (maxAmount / 10)) + 1) * 10

        set({ randomTradeDraft: { amount, duration, direction } })
      },
      confirmRandomTrade: () => {
        const draft = get().randomTradeDraft
        if (!draft || get().activeTrade) return
        set((state) => ({
          amount: draft.amount,
          duration: draft.duration,
          randomTradeDraft: null,
          logs: appendLog(
            state.logs,
            makeLog(
              'setting',
              'Lucky pick',
              `${ASSETS[state.selectedAsset].symbol} · $${draft.amount} · ${draft.duration}s · ${draft.direction === 'up' ? 'Higher' : 'Lower'}`,
            ),
          ),
        }))
        get().openTrade(draft.direction)
      },
      updateRandomTradeDraft: (draft) =>
        set((state) => state.randomTradeDraft
          ? { randomTradeDraft: { ...state.randomTradeDraft, ...draft } }
          : state),
      dismissRandomTrade: () => set({ randomTradeDraft: null }),
      marketTick: () =>
        set((state) => {
          const histories = { ...state.histories }
          const seeds = { ...state.seeds }
          for (const assetId of Object.keys(ASSETS) as AssetId[]) {
            const history = histories[assetId]
            const generated = createNextTick(assetId, history.at(-1)!, seeds[assetId])
            seeds[assetId] = generated.seed
            const sameSecond = history.at(-1)!.time === generated.tick.time
            histories[assetId] = sameSecond
              ? [...history.slice(0, -1), generated.tick]
              : [...history, generated.tick].slice(-120)
          }

          const active = state.activeTrade
          let logs = state.logs
          if (active) {
            const currentPrice = histories[active.assetId].at(-1)!.value
            logs = appendLog(
              logs,
              makeLog('market', 'Active simulation update', `${ASSETS[active.assetId].symbol} · ${currentPrice}`),
            )
            if (Date.now() >= active.expiresAt) {
              const movedUp = currentPrice > active.openPrice
              const movedDown = currentPrice < active.openPrice
              const result = currentPrice === active.openPrice
                ? 'draw'
                : (active.direction === 'up' && movedUp) || (active.direction === 'down' && movedDown)
                  ? 'win'
                  : 'loss'
              const payout = result === 'win' ? active.amount * 1.8 : result === 'draw' ? active.amount : 0
              const completed: Trade = { ...active, closePrice: currentPrice, result, payout }
              const trades = [completed, ...state.trades].slice(0, 20)
              const winStreak = result === 'win' ? state.winStreak + 1 : 0
              const progress = {
                ...state.progress,
                'fast-trade': active.duration === 5 ? 1 : (state.progress['fast-trade'] ?? 0),
                'patient-trader': active.duration === 10 ? 1 : (state.progress['patient-trader'] ?? 0),
                'first-win': result === 'win' ? 1 : (state.progress['first-win'] ?? 0),
                'win-streak': Math.min(winStreak, 3),
                'active-trader': Math.min(trades.length, 10),
              }
              const ids = [
                active.duration === 5 ? 'fast-trade' : 'patient-trader',
                ...(result === 'win' ? ['first-win'] : []),
                ...(winStreak >= 3 ? ['win-streak'] : []),
                ...(trades.length >= 10 ? ['active-trader'] : []),
              ]
              logs = appendLog(
                logs,
                makeLog(
                  'trade',
                  result === 'win' ? 'Simulation successful' : result === 'draw' ? 'No change' : 'Simulation completed',
                  `${active.openPrice} → ${currentPrice} · ${payout ? `+$${payout.toFixed(0)}` : 'no result'}`,
                ),
              )
              const next = {
                ...state,
                histories,
                seeds,
                logs,
                activeTrade: null,
                lastResult: completed,
                trades,
                balance: state.balance + payout,
                winStreak,
                progress,
              }
              const withAchievements = { ...next, ...unlock(next, ids) }
              const withDailyProgress = advanceDailyTask(withAchievements, 'complete-trades')
              return result === 'win'
                ? advanceMonthlyTask(withDailyProgress)
                : withDailyProgress
            }
          }
          return { histories, seeds, logs }
        }),
      dismissTradeResult: () => set({ lastResult: null }),
      clearLogs: () =>
        set({ logs: [makeLog('system', 'Log cleared', 'New events will appear here')] }),
      clearToast: () => set({ toast: null }),
      completeOnboarding: () =>
        set((state) => {
          if (state.onboardingCompleted) return state
          const next = {
            ...state,
            onboardingCompleted: true,
            progress: { ...state.progress, 'welcome-aboard': 1 },
            logs: appendLog(
              state.logs,
              makeLog('system', 'Getting-started tour completed', 'Your first reward is ready'),
            ),
          }
          return { ...next, ...unlock(next, ['welcome-aboard']) }
        }),
      resetDemo: () => set(baseState()),
      boostDemo: () =>
        set((state) => {
          const unlocked = Object.fromEntries(ACHIEVEMENTS.slice(0, 8).map((item) => [item.id, Date.now()]))
          return {
            ...state,
            score: 940,
            unlocked,
            toast: 'Demo boost: Master level unlocked',
            logs: appendLog(
              state.logs,
              makeLog('progression', 'Demo boost enabled', 'Profile advanced to the Master level'),
            ),
          }
        }),
      registerVisit: () =>
        set((state) => {
          const today = getLocalDateKey()
          const month = getLocalMonthKey()
          const hasToday = state.visitDates.includes(today)
          const hasCurrentDaily = state.dailyTask?.date === today
          const hasCurrentMonthly = state.monthlyTask?.month === month
          if (hasToday && hasCurrentDaily && hasCurrentMonthly) return state

          const dates = Array.from(new Set([...state.visitDates, today])).sort()
          const unlocked = { ...state.unlocked }
          const progress = { ...state.progress }
          let logs = state.logs
          let dailyTask = state.dailyTask
          let monthlyTask = state.monthlyTask

          if (!hasCurrentDaily) {
            const dailyDefinition = getDailyTask(today)
            delete unlocked['daily-challenge']
            progress['daily-challenge'] = 0
            dailyTask = {
              date: today,
              taskId: dailyDefinition.id,
              progress: 0,
              completed: false,
              actionKeys: [],
            }
            logs = appendLog(logs, makeLog('system', 'New daily challenge', dailyDefinition.title))
          }

          if (!hasCurrentMonthly) {
            const monthlyReward = getMonthlyCosmetic(month)
            delete unlocked['monthly-challenge']
            progress['monthly-challenge'] = 0
            monthlyTask = {
              month,
              progress: 0,
              completed: false,
              rewardId: monthlyReward.id,
            }
            logs = appendLog(
              logs,
              makeLog('system', 'New monthly challenge', `Reward: ${monthlyReward.name}`),
            )
          }

          let streak = 1
          for (let index = dates.length - 1; index > 0; index -= 1) {
            const current = new Date(`${dates[index]}T12:00:00Z`)
            const previous = new Date(`${dates[index - 1]}T12:00:00Z`)
            const difference = (current.getTime() - previous.getTime()) / 86_400_000
            if (difference !== 1) break
            streak += 1
          }

          if (!hasToday) {
            progress['three-day-streak'] = Math.min(streak, 3)
            logs = appendLog(
              logs,
              makeLog(
                'progression',
                'Daily streak',
                `${Math.min(streak, 3)}/3 · visit counted`,
              ),
            )
          }

          const next = {
            ...state,
            unlocked,
            visitDates: dates.slice(-30),
            visitStreak: streak,
            dailyTask,
            monthlyTask,
            progress,
            logs,
          }
          return !hasToday && streak >= 3
            ? { ...next, ...unlock(next, ['three-day-streak']) }
            : next
        }),
      visitPage: (page) =>
        set((state) => {
          if (state.visitedPages.includes(page)) return state
          const visitedPages = [...state.visitedPages, page]
          const progress = {
            ...state.progress,
            'full-route': Math.min(visitedPages.length, 3),
          }
          const next = { ...state, visitedPages, progress }
          return visitedPages.length >= 3 ? { ...next, ...unlock(next, ['full-route']) } : next
        }),
      openHelpTopic: (topic) =>
        set((state) => {
          if (state.helpTopics.includes(topic)) {
            return advanceDailyTask(state, 'help-topics', topic)
          }
          const helpTopics = [...state.helpTopics, topic]
          const progress = {
            ...state.progress,
            'help-explorer': Math.min(helpTopics.length, 3),
          }
          const next = {
            ...state,
            helpTopics,
            progress,
            logs: appendLog(
              state.logs,
              makeLog('system', 'Help topic opened', `${helpTopics.length}/3 topics explored`),
            ),
          }
          const withAchievements = helpTopics.length >= 3
            ? { ...next, ...unlock(next, ['help-explorer']) }
            : next
          return advanceDailyTask(withAchievements, 'help-topics', topic)
        }),
      completeHelp: () =>
        set((state) => {
          if (state.unlocked['help-reader']) return state
          const next = {
            ...state,
            progress: { ...state.progress, 'help-reader': 1 },
            logs: appendLog(
              state.logs,
              makeLog('system', 'Guide completed', 'Help Center material completed'),
            ),
          }
          return { ...next, ...unlock(next, ['help-reader']) }
        }),
      selectCosmetic: (cosmeticId) =>
        set((state) => {
          if (cosmeticId && !state.ownedCosmetics.includes(cosmeticId)) return state
          const cosmetic = COSMETICS.find((item) => item.id === cosmeticId)
          return {
            selectedCosmetic: cosmeticId,
            logs: appendLog(
              state.logs,
              makeLog(
                'progression',
                'Mascot appearance changed',
                cosmetic?.name ?? 'No item',
              ),
            ),
          }
        }),
    }),
    {
      name: 'demo-workspace-v1',
      partialize: (state) => ({
        balance: state.balance,
        score: state.score,
        trades: state.trades,
        unlocked: state.unlocked,
        progress: state.progress,
        tradedAssets: state.tradedAssets,
        winStreak: state.winStreak,
        assetSwitches: state.assetSwitches,
        visitDates: state.visitDates,
        visitStreak: state.visitStreak,
        helpTopics: state.helpTopics,
        visitedPages: state.visitedPages,
        dailyTask: state.dailyTask,
        monthlyTask: state.monthlyTask,
        ownedCosmetics: state.ownedCosmetics,
        selectedCosmetic: state.selectedCosmetic,
        onboardingCompleted: state.onboardingCompleted,
      }),
    },
  ),
)

export const getCurrentPrice = (assetId: AssetId) =>
  useTradingStore.getState().histories[assetId].at(-1)!.value
