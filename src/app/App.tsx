/**
 * Application shell: navigation, routing, demo-wide controls (boost, reset),
 * the market tick loop, and the onboarding tour.
 *
 * Mounted once from `main.tsx`.
 */
import { useEffect } from 'react'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  LifeBuoy,
  RotateCcw,
  Sparkles,
  Trophy,
  UserRound,
  Zap,
} from 'lucide-react'
import { AchievementsPage } from '../features/achievements/AchievementsPage'
import { HelpPage } from '../features/help/HelpPage'
import { Onboarding } from '../features/onboarding/Onboarding'
import { TradePage } from '../features/trading/TradePage'
import { useTradingStore } from '../features/trading/store'
import { ACHIEVEMENTS, getLevel, getNextLevel } from '../shared/config'
import { Avatar } from '../shared/Avatar'

function Sidebar() {
  const unlockedCount = useTradingStore((state) => Object.keys(state.unlocked).length)
  const resetDemo = useTradingStore((state) => state.resetDemo)
  const boostDemo = useTradingStore((state) => state.boostDemo)

  const reset = () => {
    if (window.confirm('Reset the balance, userscore, simulations, and all achievements?')) resetDemo()
  }

  return (
    <aside className="sidebar">
      <div className="brand"><span><BarChart3 /></span><strong>Demo Workspace</strong></div>
      <nav aria-label="Main navigation">
        <NavLink to="/trade"><BarChart3 /><span>Workspace</span></NavLink>
        <NavLink to="/achievements">
          <Trophy /><span>Achievements</span><b>{unlockedCount}/{ACHIEVEMENTS.length}</b>
        </NavLink>
        <NavLink to="/help"><LifeBuoy /><span>Help Center</span></NavLink>
      </nav>
      <div className="sidebar-bottom">
        <button onClick={boostDemo}><Zap /><span>Demo boost</span></button>
        <button onClick={reset}><RotateCcw /><span>Reset demo</span></button>
        <div className="demo-chip"><i /> Demo environment</div>
      </div>
    </aside>
  )
}

function ProfileBar() {
  const score = useTradingStore((state) => state.score)
  const balance = useTradingStore((state) => state.balance)
  const selectedCosmetic = useTradingStore((state) => state.selectedCosmetic)
  const level = getLevel(score)
  const next = getNextLevel(score)
  const progress = next
    ? ((score - level.minScore) / (next.minScore - level.minScore)) * 100
    : 100

  return (
    <header className="topbar">
      <div className="topbar-title">
        <span className="live-dot" />
        <span>Live demo terminal</span>
      </div>
      <div className="topbar-actions">
        <div className="account-summary">
          <strong>${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
          <small>Demo Account</small>
        </div>
        <button className="payments-button">Add funds</button>
        <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /></button>
        <NavLink to="/achievements" className="profile-score">
          <Avatar src={level.avatar} alt="" cosmeticId={selectedCosmetic} className="profile-avatar" />
          <div>
            <span><strong>{level.name}</strong><small>{score} userscore</small></span>
            <div className="top-progress"><i style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></div>
          </div>
          <Sparkles size={16} />
        </NavLink>
        <button className="icon-button user-button" aria-label="Profile"><UserRound size={18} /></button>
      </div>
    </header>
  )
}

function Toast() {
  const toast = useTradingStore((state) => state.toast)
  const clearToast = useTradingStore((state) => state.clearToast)
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(clearToast, 4500)
    return () => window.clearTimeout(timer)
  }, [toast, clearToast])
  if (!toast) return null
  return <div className="toast"><Trophy /> <span>{toast}</span></div>
}

export function App() {
  const marketTick = useTradingStore((state) => state.marketTick)
  const registerVisit = useTradingStore((state) => state.registerVisit)
  const visitPage = useTradingStore((state) => state.visitPage)
  const location = useLocation()
  const isTerminal = location.pathname === '/trade' || location.pathname === '/'

  useEffect(() => {
    const timer = window.setInterval(marketTick, 500)
    return () => window.clearInterval(timer)
  }, [marketTick])

  useEffect(() => {
    registerVisit()
  }, [registerVisit])

  useEffect(() => {
    const page = location.pathname === '/achievements'
      ? 'achievements'
      : location.pathname === '/help'
        ? 'help'
        : 'trade'
    visitPage(page)
  }, [location.pathname, visitPage])

  return (
    <div className={`app-shell ${isTerminal ? 'terminal-mode' : ''}`}>
      <Sidebar />
      <div className="workspace">
        <ProfileBar />
        <main>
          <Routes>
            <Route path="/trade" element={<TradePage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<Navigate to="/trade" replace />} />
          </Routes>
        </main>
      </div>
      <Onboarding />
      <Toast />
    </div>
  )
}
