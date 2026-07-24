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
    name: 'Новичок',
    minScore: 0,
    avatar: publicAsset('avatars/avatar-novice.png'),
    color: '#7b8ba7',
    description: 'Знакомится с рынком',
  },
  {
    id: 2,
    name: 'Трейдер',
    minScore: 100,
    avatar: publicAsset('avatars/avatar-trader.png'),
    color: '#28c76f',
    description: 'Уверенно входит в ритм',
  },
  {
    id: 3,
    name: 'Про',
    minScore: 250,
    avatar: publicAsset('avatars/avatar-pro-v2.png'),
    color: '#7e8dff',
    description: 'Читает движение рынка',
  },
  {
    id: 4,
    name: 'Эксперт',
    minScore: 500,
    avatar: publicAsset('avatars/avatar-expert.png'),
    color: '#b28cff',
    description: 'Действует системно',
  },
  {
    id: 5,
    name: 'Гуру',
    minScore: 900,
    avatar: publicAsset('avatars/avatar-guru-v2.png'),
    color: '#ffd166',
    description: 'Видит рынок на шаг вперёд',
  },
]

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-trade',
    title: 'Первый прогноз',
    description: 'Откройте первую сделку',
    reward: 60,
    category: 'Старт',
    target: 1,
    icon: 'Rocket',
  },
  {
    id: 'fast-trade',
    title: 'Молниеносный старт',
    description: 'Завершите сделку на 5 секунд',
    reward: 50,
    category: 'Старт',
    target: 1,
    icon: 'Zap',
  },
  {
    id: 'patient-trader',
    title: 'Терпение трейдера',
    description: 'Завершите сделку на 10 секунд',
    reward: 70,
    category: 'Торговля',
    target: 1,
    icon: 'Timer',
  },
  {
    id: 'first-win',
    title: 'Первые в плюсе',
    description: 'Выиграйте первую сделку',
    reward: 80,
    category: 'Старт',
    target: 1,
    icon: 'TrendingUp',
  },
  {
    id: 'win-streak',
    title: 'Серия из трёх',
    description: 'Выиграйте 3 сделки подряд',
    reward: 160,
    category: 'Мастерство',
    target: 3,
    icon: 'Flame',
  },
  {
    id: 'market-explorer',
    title: 'Исследователь рынка',
    description: 'Совершите сделки по обоим активам',
    reward: 100,
    category: 'Исследование',
    target: 2,
    icon: 'Compass',
  },
  {
    id: 'active-trader',
    title: 'Активный участник',
    description: 'Завершите 10 сделок',
    reward: 150,
    category: 'Торговля',
    target: 10,
    icon: 'Activity',
  },
  {
    id: 'big-trade',
    title: 'Крупная ставка',
    description: 'Откройте сделку на $250 или больше',
    reward: 100,
    category: 'Мастерство',
    target: 1,
    icon: 'Gem',
  },
  {
    id: 'score-century',
    title: 'Круглая сотня',
    description: 'Наберите 100 userscore',
    reward: 40,
    category: 'Мастерство',
    target: 100,
    icon: 'Award',
  },
  {
    id: 'curious-clicker',
    title: 'Любопытство — сила',
    description: 'Секретное условие',
    reward: 90,
    category: 'Исследование',
    target: 5,
    hidden: true,
    icon: 'Sparkles',
  },
  {
    id: 'three-day-streak',
    title: 'На связи',
    description: 'Заходите на платформу 3 дня подряд',
    reward: 120,
    category: 'Исследование',
    target: 3,
    icon: 'CalendarCheck',
  },
  {
    id: 'help-reader',
    title: 'Теория перед практикой',
    description: 'Дочитайте руководство в Хелп-центре',
    reward: 70,
    category: 'Старт',
    target: 1,
    icon: 'BookOpenCheck',
  },
  {
    id: 'help-explorer',
    title: 'Знаю, где искать',
    description: 'Изучите все темы Хелп-центра',
    reward: 90,
    category: 'Исследование',
    target: 3,
    icon: 'Brain',
  },
  {
    id: 'full-route',
    title: 'Полный маршрут',
    description: 'Посетите Торговлю, Ачивки и Хелп-центр',
    reward: 80,
    category: 'Исследование',
    target: 3,
    icon: 'Map',
  },
  {
    id: 'daily-challenge',
    title: 'Задание дня',
    description: 'Выполните персональное задание до конца дня',
    reward: 75,
    category: 'Торговля',
    target: 1,
    icon: 'CalendarClock',
  },
  {
    id: 'monthly-challenge',
    title: 'Задание месяца',
    description: 'Закройте 5 сделок в плюс за календарный месяц',
    reward: 250,
    category: 'Мастерство',
    target: 5,
    icon: 'CalendarRange',
  },
]

export const DAILY_TASKS: DailyTaskDefinition[] = [
  {
    id: 'asset-hopper',
    kind: 'switch-assets',
    title: 'Рыночный радар',
    description: 'Переключитесь между активами 3 раза',
    target: 3,
    icon: 'RefreshCw',
  },
  {
    id: 'two-finishes',
    kind: 'complete-trades',
    title: 'Две точки',
    description: 'Завершите 2 сделки любой длительности',
    target: 2,
    icon: 'Flag',
  },
  {
    id: 'bold-move',
    kind: 'large-trade',
    title: 'Смелый ход',
    description: 'Откройте сделку на $250 или больше',
    target: 1,
    icon: 'Gem',
  },
  {
    id: 'knowledge-minute',
    kind: 'help-topics',
    title: 'Минута знаний',
    description: 'Откройте 2 темы в Хелп-центре',
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
    name: 'Футбольный мяч',
    description: 'Эксклюзивный предмет июльской Лиги профита',
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
