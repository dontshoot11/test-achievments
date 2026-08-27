export type AssetId = 'BTCUSD' | 'ETHUSD'
export type Direction = 'up' | 'down'
export type TradeDuration = 5 | 10
export type TradeResult = 'win' | 'loss' | 'draw'

export interface Tick {
  time: number
  value: number
}

export interface Asset {
  id: AssetId
  symbol: string
  name: string
  startPrice: number
  volatility: number
  decimals: number
}

/** Simulation snapshot used for active, completed, and persisted trade state. */
export interface Trade {
  id: string
  assetId: AssetId
  direction: Direction
  amount: number
  duration: TradeDuration
  openPrice: number
  closePrice?: number
  openedAt: number
  expiresAt: number
  result?: TradeResult
  payout?: number
  randomized?: boolean
}

export type EventType =
  | 'system'
  | 'market'
  | 'setting'
  | 'trade'
  | 'balance'
  | 'achievement'
  | 'progression'

export interface LogEvent {
  id: string
  type: EventType
  title: string
  detail: string
  timestamp: number
}

export interface AchievementDefinition {
  id: string
  title: string
  description: string
  reward: number
  category: 'Getting started' | 'Activity' | 'Exploration' | 'Mastery'
  target: number
  hidden?: boolean
  icon: string
}

export interface Level {
  id: number
  name: string
  minScore: number
  avatar: string
  color: string
  description: string
}

export type DailyTaskKind =
  | 'switch-assets'
  | 'complete-trades'
  | 'large-trade'
  | 'help-topics'

export interface DailyTaskDefinition {
  id: string
  kind: DailyTaskKind
  title: string
  description: string
  target: number
  icon: string
}

export interface DailyTaskState {
  date: string
  taskId: string
  progress: number
  completed: boolean
  actionKeys: string[]
}

export interface CosmeticItem {
  id: string
  name: string
  description: string
  icon: string
  month: string
  rarity: 'exclusive'
}

export interface MonthlyTaskState {
  month: string
  progress: number
  completed: boolean
  rewardId: string
}
