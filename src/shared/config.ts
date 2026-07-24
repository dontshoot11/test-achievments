import type {
  AchievementDefinition,
  Asset,
  AssetId,
  CosmeticItem,
  DailyTaskDefinition,
  Level,
} from './types'

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const ASSETS: Record<AssetId, Asset> = {
  BTCUSD: {
    id: 'BTCUSD',
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    startPrice: 67_420,
    volatility: 0.00055,
    decimals: 2,
  },
  ETHUSD: {
    id: 'ETHUSD',
    symbol: 'ETH/USD',
    name: 'Ethereum',
    startPrice: 3_486,
    volatility: 0.0008,
    decimals: 2,
  },
}

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Beginner',
    minScore: 0,
    avatar: publicAsset('avatars/avatar-novice.png'),
    color: '#7b8ba7',
    description: 'Learning the basics',
  },
  {
    id: 2,
    name: 'Explorer',
    minScore: 100,
    avatar: publicAsset('avatars/avatar-trader.png'),
    color: '#28c76f',
    description: 'Building confidence',
  },
  {
    id: 3,
    name: 'Advanced',
    minScore: 250,
    avatar: publicAsset('avatars/avatar-pro-v2.png'),
    color: '#7e8dff',
    description: 'Recognizing patterns',
  },
  {
    id: 4,
    name: 'Expert',
    minScore: 500,
    avatar: publicAsset('avatars/avatar-expert.png'),
    color: '#b28cff',
    description: 'Working systematically',
  },
  {
    id: 5,
    name: 'Master',
    minScore: 900,
    avatar: publicAsset('avatars/avatar-guru-v2.png'),
    color: '#ffd166',
    description: 'Staying one step ahead',
  },
]

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'welcome-aboard',
    title: 'Welcome Aboard',
    description: 'Complete the getting-started tour',
    reward: 50,
    category: 'Getting started',
    target: 1,
    icon: 'Sparkles',
  },
  {
    id: 'first-trade',
    title: 'First Prediction',
    description: 'Start your first simulation',
    reward: 60,
    category: 'Getting started',
    target: 1,
    icon: 'Rocket',
  },
  {
    id: 'fast-trade',
    title: 'Quick Start',
    description: 'Complete a 5-second simulation',
    reward: 50,
    category: 'Getting started',
    target: 1,
    icon: 'Zap',
  },
  {
    id: 'patient-trader',
    title: 'Take Your Time',
    description: 'Complete a 10-second simulation',
    reward: 70,
    category: 'Activity',
    target: 1,
    icon: 'Timer',
  },
  {
    id: 'first-win',
    title: 'First Success',
    description: 'Win your first simulation',
    reward: 80,
    category: 'Getting started',
    target: 1,
    icon: 'TrendingUp',
  },
  {
    id: 'win-streak',
    title: 'Three in a Row',
    description: 'Win 3 simulations in a row',
    reward: 160,
    category: 'Mastery',
    target: 3,
    icon: 'Flame',
  },
  {
    id: 'market-explorer',
    title: 'Data Explorer',
    description: 'Run simulations for both datasets',
    reward: 100,
    category: 'Exploration',
    target: 2,
    icon: 'Compass',
  },
  {
    id: 'active-trader',
    title: 'Active Participant',
    description: 'Complete 10 simulations',
    reward: 150,
    category: 'Activity',
    target: 10,
    icon: 'Activity',
  },
  {
    id: 'big-trade',
    title: 'Bold Move',
    description: 'Start a simulation with $250 or more',
    reward: 100,
    category: 'Mastery',
    target: 1,
    icon: 'Gem',
  },
  {
    id: 'score-century',
    title: 'First Hundred',
    description: 'Earn 100 userscore',
    reward: 40,
    category: 'Mastery',
    target: 100,
    icon: 'Award',
  },
  {
    id: 'curious-clicker',
    title: 'Curiosity Pays',
    description: 'Secret requirement',
    reward: 90,
    category: 'Exploration',
    target: 5,
    hidden: true,
    icon: 'Sparkles',
  },
  {
    id: 'three-day-streak',
    title: 'Keep in Touch',
    description: 'Visit the workspace 3 days in a row',
    reward: 120,
    category: 'Exploration',
    target: 3,
    icon: 'CalendarCheck',
  },
  {
    id: 'help-reader',
    title: 'Learn the Essentials',
    description: 'Finish the guide in the Help Center',
    reward: 70,
    category: 'Getting started',
    target: 1,
    icon: 'BookOpenCheck',
  },
  {
    id: 'help-explorer',
    title: 'Know Where to Look',
    description: 'Explore every Help Center topic',
    reward: 90,
    category: 'Exploration',
    target: 3,
    icon: 'Brain',
  },
  {
    id: 'full-route',
    title: 'Full Tour',
    description: 'Visit the Workspace, Achievements, and Help Center',
    reward: 80,
    category: 'Exploration',
    target: 3,
    icon: 'Map',
  },
  {
    id: 'daily-challenge',
    title: 'Daily Challenge',
    description: 'Complete your personal challenge before the day ends',
    reward: 75,
    category: 'Activity',
    target: 1,
    icon: 'CalendarClock',
  },
  {
    id: 'monthly-challenge',
    title: 'Monthly Challenge',
    description: 'Complete 5 successful simulations this calendar month',
    reward: 250,
    category: 'Mastery',
    target: 5,
    icon: 'CalendarRange',
  },
]

export const DAILY_TASKS: DailyTaskDefinition[] = [
  {
    id: 'asset-hopper',
    kind: 'switch-assets',
    title: 'Data Radar',
    description: 'Switch between datasets 3 times',
    target: 3,
    icon: 'RefreshCw',
  },
  {
    id: 'two-finishes',
    kind: 'complete-trades',
    title: 'Two Points',
    description: 'Complete 2 simulations of any duration',
    target: 2,
    icon: 'Flag',
  },
  {
    id: 'bold-move',
    kind: 'large-trade',
    title: 'Bold Move',
    description: 'Start a simulation with $250 or more',
    target: 1,
    icon: 'Gem',
  },
  {
    id: 'knowledge-minute',
    kind: 'help-topics',
    title: 'Knowledge Minute',
    description: 'Open 2 Help Center topics',
    target: 2,
    icon: 'BookOpen',
  },
]

export const getDailyTask = (dateKey: string) => {
  const hash = [...dateKey].reduce((value, character) => (
    ((value * 31) + character.charCodeAt(0)) >>> 0
  ), 7)
  return DAILY_TASKS[hash % DAILY_TASKS.length]
}

export const COSMETICS: CosmeticItem[] = [
  {
    id: 'football-2026-07',
    name: 'Football',
    description: 'Exclusive reward for the July monthly challenge',
    icon: '⚽',
    month: '2026-07',
    rarity: 'exclusive',
  },
]

export const getMonthlyCosmetic = (monthKey: string) =>
  COSMETICS.find((item) => item.month === monthKey) ?? COSMETICS.at(-1)!

export const getLevel = (score: number) =>
  [...LEVELS].reverse().find((level) => score >= level.minScore) ?? LEVELS[0]

export const getNextLevel = (score: number) =>
  LEVELS.find((level) => level.minScore > score)
