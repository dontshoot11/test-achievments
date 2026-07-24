import { useState, type ComponentType } from 'react'
import {
  Activity,
  Award,
  BookOpen,
  BookOpenCheck,
  Brain,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  Check,
  Compass,
  Flame,
  Flag,
  Gem,
  LockKeyhole,
  Map,
  RefreshCw,
  Rocket,
  Sparkles,
  Timer,
  TrendingUp,
  Zap,
  type LucideProps,
} from 'lucide-react'
import { ACHIEVEMENTS, DAILY_TASKS, getLevel, getNextLevel } from '../../shared/config'
import { COSMETICS, getMonthlyCosmetic } from '../../shared/config'
import { Avatar } from '../../shared/Avatar'
import { useTradingStore } from '../trading/store'

const icons: Record<string, ComponentType<LucideProps>> = {
  Activity,
  Award,
  BookOpen,
  BookOpenCheck,
  Brain,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  Compass,
  Flame,
  Flag,
  Gem,
  Map,
  RefreshCw,
  Rocket,
  Sparkles,
  Timer,
  TrendingUp,
  Zap,
}

type Filter = 'all' | 'open' | 'locked'

export function AchievementsPage() {
  const unlocked = useTradingStore((state) => state.unlocked)
  const progress = useTradingStore((state) => state.progress)
  const score = useTradingStore((state) => state.score)
  const dailyTask = useTradingStore((state) => state.dailyTask)
  const monthlyTask = useTradingStore((state) => state.monthlyTask)
  const ownedCosmetics = useTradingStore((state) => state.ownedCosmetics)
  const selectedCosmetic = useTradingStore((state) => state.selectedCosmetic)
  const selectCosmetic = useTradingStore((state) => state.selectCosmetic)
  const [filter, setFilter] = useState<Filter>('all')
  const level = getLevel(score)
  const nextLevel = getNextLevel(score)
  const dailyDefinition = dailyTask
    ? DAILY_TASKS.find((task) => task.id === dailyTask.taskId)
    : undefined
  const monthlyReward = monthlyTask ? getMonthlyCosmetic(monthlyTask.month) : undefined
  const visible = ACHIEVEMENTS.filter((item) =>
    filter === 'open' ? Boolean(unlocked[item.id]) : filter === 'locked' ? !unlocked[item.id] : true,
  )

  return (
    <div className="achievements-page">
      <header className="page-title">
        <div>
          <p className="eyebrow">Progress collection</p>
          <h1>Achievements</h1>
          <p>Explore the demo, complete simulations, and evolve your mascot.</p>
        </div>
        <span className="count-badge">{Object.keys(unlocked).length} / {ACHIEVEMENTS.length} unlocked</span>
      </header>

      <section className="progress-hero panel">
        <Avatar
          src={level.avatar}
          alt={`${level.name} level avatar`}
          cosmeticId={selectedCosmetic}
          className="hero-avatar"
        />
        <div className="hero-copy">
          <span className="level-label" style={{ color: level.color }}>Level {level.id} · {level.name}</span>
          <h2>{level.description}</h2>
          <div className="hero-score"><strong>{score}</strong><span>userscore</span></div>
          <div className="score-track">
            <span
              style={{
                width: nextLevel
                  ? `${Math.min(100, ((score - level.minScore) / (nextLevel.minScore - level.minScore)) * 100)}%`
                  : '100%',
              }}
            />
          </div>
          <p>{nextLevel ? `${nextLevel.minScore - score} more to reach ${nextLevel.name}` : 'Maximum level reached'}</p>
        </div>
        <div className="hero-stat">
          <span>Overall progress</span>
          <strong>{Math.round((Object.keys(unlocked).length / ACHIEVEMENTS.length) * 100)}%</strong>
        </div>
      </section>

      {dailyTask && dailyDefinition && (
        <section className={`daily-task panel ${dailyTask.completed ? 'completed' : ''}`}>
          <span className="daily-icon">
            {(() => {
              const DailyIcon = icons[dailyDefinition.icon] ?? CalendarClock
              return <DailyIcon />
            })()}
          </span>
          <div className="daily-copy">
            <span>Daily challenge · refreshes tomorrow</span>
            <h2>{dailyDefinition.title}</h2>
            <p>{dailyDefinition.description}</p>
          </div>
          <div className="daily-status">
            <strong>{dailyTask.completed ? <><Check /> Completed</> : `${dailyTask.progress}/${dailyDefinition.target}`}</strong>
            <div className="score-track">
              <span style={{ width: `${(dailyTask.progress / dailyDefinition.target) * 100}%` }} />
            </div>
            <small>Reward +75 userscore</small>
          </div>
        </section>
      )}

      {monthlyTask && monthlyReward && (
        <section className={`monthly-task panel ${monthlyTask.completed ? 'completed' : ''}`}>
          <div className="monthly-reward">
            <span>{monthlyReward.icon}</span>
            <small>Exclusive</small>
          </div>
          <div className="monthly-copy">
            <span>Monthly challenge · {monthlyTask.month}</span>
            <h2>Monthly Milestone</h2>
            <p>Complete 5 successful simulations to receive the {monthlyReward.name} item.</p>
            <div className="monthly-progress">
              <div className="score-track">
                <span style={{ width: `${(monthlyTask.progress / 5) * 100}%` }} />
              </div>
              <strong>{monthlyTask.progress}/5 successes</strong>
            </div>
          </div>
          <div className="monthly-prize">
            <span>Monthly reward</span>
            <strong>{monthlyReward.name}</strong>
            <small>+250 userscore · permanently added to your collection</small>
          </div>
        </section>
      )}

      <section className="wardrobe">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Personalization</p>
            <h2>Mascot collection</h2>
          </div>
          <span>{ownedCosmetics.length} items unlocked</span>
        </div>
        <div className="wardrobe-list">
          <button
            className={selectedCosmetic === null ? 'selected' : ''}
            onClick={() => selectCosmetic(null)}
          >
            <span>∅</span>
            <strong>No item</strong>
            <small>Default look</small>
          </button>
          {COSMETICS.map((cosmetic) => {
            const isOwned = ownedCosmetics.includes(cosmetic.id)
            return (
              <button
                key={cosmetic.id}
                className={`${selectedCosmetic === cosmetic.id ? 'selected' : ''} ${isOwned ? '' : 'locked'}`}
                disabled={!isOwned}
                onClick={() => selectCosmetic(cosmetic.id)}
              >
                <span>{isOwned ? cosmetic.icon : '🔒'}</span>
                <strong>{cosmetic.name}</strong>
                <small>{isOwned ? 'Exclusive unlocked' : 'Reward for 5 successes'}</small>
              </button>
            )
          })}
        </div>
      </section>

      <div className="achievement-toolbar">
        <div className="filter-tabs">
          {([
            ['all', 'All'],
            ['open', 'Unlocked'],
            ['locked', 'Locked'],
          ] as Array<[Filter, string]>).map(([value, label]) => (
            <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>
              {label}
            </button>
          ))}
        </div>
        <p>Each reward can be earned only once</p>
      </div>

      <div className="achievement-grid">
        {visible.map((achievement) => {
          const isOpen = Boolean(unlocked[achievement.id])
          const current = progress[achievement.id] ?? (isOpen ? achievement.target : 0)
          const Icon = icons[achievement.icon] ?? Award
          return (
            <article key={achievement.id} className={`achievement-card panel ${isOpen ? 'open' : 'locked'}`}>
              <div className="achievement-icon">
                {achievement.hidden && !isOpen ? <LockKeyhole /> : <Icon />}
                {isOpen && <span><Check size={12} /></span>}
              </div>
              <div className="achievement-copy">
                <span>{achievement.category}</span>
                <h3>{achievement.hidden && !isOpen ? 'Secret achievement' : achievement.title}</h3>
                <p>{achievement.hidden && !isOpen ? 'Keep exploring the interface' : achievement.description}</p>
              </div>
              <div className="achievement-footer">
                <div>
                  <div className="mini-track"><span style={{ width: `${Math.min(100, (current / achievement.target) * 100)}%` }} /></div>
                  <small>{isOpen ? new Date(unlocked[achievement.id]).toLocaleDateString('en-US') : `${current} / ${achievement.target}`}</small>
                </div>
                <strong>+{achievement.reward}</strong>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
