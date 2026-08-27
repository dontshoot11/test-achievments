/**
 * Workspace screen: dataset switcher with the live chart, simulation controls
 * (including the random "I feel lucky" run), simulation history, and activity log.
 *
 * Rendered by the `/` route; all state comes from `useTradingStore`.
 */
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Bitcoin,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  CandlestickChart,
  Dices,
  Eraser,
  Minus,
  Plus,
  Radio,
  ScrollText,
  Wallet,
} from 'lucide-react'
import { ASSETS } from '../../shared/config'
import type { EventType } from '../../shared/types'
import { PriceChart } from './PriceChart'
import { useTradingStore } from './store'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const EVENT_LABELS: Record<EventType | 'all', string> = {
  all: 'All',
  system: 'System',
  market: 'Updates',
  setting: 'Settings',
  trade: 'Simulations',
  balance: 'Balance',
  achievement: 'Achievements',
  progression: 'Levels',
}

function TradeControls() {
  const amount = useTradingStore((state) => state.amount)
  const duration = useTradingStore((state) => state.duration)
  const balance = useTradingStore((state) => state.balance)
  const activeTrade = useTradingStore((state) => state.activeTrade)
  const setAmount = useTradingStore((state) => state.setAmount)
  const setDuration = useTradingStore((state) => state.setDuration)
  const openTrade = useTradingStore((state) => state.openTrade)
  const openRandomTrade = useTradingStore((state) => state.openRandomTrade)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!activeTrade) return
    const timer = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(timer)
  }, [activeTrade])

  const remaining = activeTrade ? Math.max(0, activeTrade.expiresAt - now) : 0
  const invalid = amount < 10 || amount > balance

  return (
    <aside className="trade-panel panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">New simulation</p>
          <h2>Your prediction</h2>
        </div>
        <CircleDollarSign size={20} aria-hidden />
      </div>

      {activeTrade ? (
        <div className="active-trade">
          <div className="countdown-ring" style={{ '--progress': remaining / (activeTrade.duration * 1000) } as React.CSSProperties}>
            <strong>{(remaining / 1000).toFixed(1)}</strong>
            <span>sec</span>
          </div>
          <div>
            <span className={`direction-pill ${activeTrade.direction}`}>
              {activeTrade.direction === 'up' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              {activeTrade.direction === 'up' ? 'Higher' : 'Lower'}
            </span>
            <h3>{ASSETS[activeTrade.assetId].symbol}</h3>
            <p>Start: {money.format(activeTrade.openPrice)}</p>
            <p>Amount: {money.format(activeTrade.amount)}</p>
          </div>
        </div>
      ) : (
        <>
          <label className="field">
            <span>Simulation amount</span>
            <div className="amount-input">
              <span>$</span>
              <input
                type="number"
                min="10"
                max={balance}
                step="10"
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
            </div>
            {invalid && <small>Enter between $10 and {money.format(balance)}</small>}
          </label>
          <div className="amount-stepper" aria-label="Change amount">
            <button onClick={() => setAmount(Math.max(10, amount - 10))} aria-label="Decrease amount">
              <Minus />
            </button>
            <button onClick={() => setAmount(Math.min(balance, amount + 10))} aria-label="Increase amount">
              <Plus />
            </button>
          </div>
          <fieldset className="duration-picker">
            <legend>Simulation duration</legend>
            {[5, 10].map((value) => (
              <button
                key={value}
                className={duration === value ? 'selected' : ''}
                onClick={() => setDuration(value as 5 | 10)}
              >
                <Clock3 size={15} /> {value} sec
              </button>
            ))}
          </fieldset>
          <div className="payout-row">
            <span>Potential result</span>
            <strong>{money.format(amount * 1.8)}</strong>
          </div>
          <div className="orders-status">
            <strong>Simulation ready</strong>
            <Clock3 />
          </div>
          <div className="direction-buttons">
            <button className="trade-button up" disabled={invalid} onClick={() => openTrade('up')}>
              <ArrowUpRight /> Higher
            </button>
            <button className="trade-button down" disabled={invalid} onClick={() => openTrade('down')}>
              <ArrowDownRight /> Lower
            </button>
          </div>
          <button
            className="lucky-button"
            disabled={balance < 10}
            onClick={openRandomTrade}
            title="Random dataset, amount, duration, and direction"
          >
            <Dices size={17} /> I feel lucky
          </button>
        </>
      )}
      <div className="balance-line">
        <Wallet size={16} />
        Demo balance <strong>{money.format(balance)}</strong>
      </div>
    </aside>
  )
}

function EventLog() {
  const logs = useTradingStore((state) => state.logs)
  const clearLogs = useTradingStore((state) => state.clearLogs)
  const [filter, setFilter] = useState<EventType | 'all'>('all')
  const filtered = filter === 'all' ? logs : logs.filter((log) => log.type === filter)

  return (
    <section className="event-log panel">
      <div className="log-toolbar">
        <div className="panel-heading compact">
          <ScrollText size={18} />
          <div>
            <p className="eyebrow">Live telemetry</p>
            <h2>Activity log</h2>
          </div>
        </div>
        <div className="log-actions">
          <label>
            <span className="sr-only">Filter events</span>
            <select value={filter} onChange={(event) => setFilter(event.target.value as EventType | 'all')}>
              {Object.entries(EVENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <button className="icon-button" onClick={clearLogs} aria-label="Clear log">
            <Eraser size={17} />
          </button>
        </div>
      </div>
      <div className="log-list">
        {[...filtered].reverse().slice(0, 28).map((log) => (
          <article className="log-item" key={log.id}>
            <time>{new Date(log.timestamp).toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit' })}</time>
            <span className={`event-dot ${log.type}`} />
            <div>
              <strong>{log.title}</strong>
              <p>{log.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function TradeHistory() {
  const trades = useTradingStore((state) => state.trades)

  return (
    <section className="history panel">
      <div className="panel-heading compact">
        <Clock3 size={18} />
        <div>
          <p className="eyebrow">Latest results</p>
          <h2>Simulation history</h2>
        </div>
      </div>
      {trades.length === 0 ? (
        <div className="empty-state">Your first completed simulation will appear here</div>
      ) : (
        <div className="history-list">
          {trades.slice(0, 5).map((trade) => (
            <article key={trade.id}>
              <span className={`result-icon ${trade.result}`}>
                {trade.direction === 'up' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              </span>
              <div>
                <strong>{ASSETS[trade.assetId].symbol}</strong>
                <small>{trade.duration} sec · {money.format(trade.amount)}</small>
              </div>
              <span className={`result ${trade.result}`}>
                {trade.result === 'win' ? `+${money.format(trade.payout ?? 0)}` : trade.result === 'draw' ? 'Returned' : '−'}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export function TradePage() {
  const selectedAsset = useTradingStore((state) => state.selectedAsset)
  const selectAsset = useTradingStore((state) => state.selectAsset)
  const histories = useTradingStore((state) => state.histories)
  const activeTrade = useTradingStore((state) => state.activeTrade)
  const ticks = histories[selectedAsset]
  const current = ticks.at(-1)!.value
  const baseline = ticks[Math.max(0, ticks.length - 60)].value
  const change = ((current - baseline) / baseline) * 100
  const positive = change >= 0
  const chartTrade = activeTrade?.assetId === selectedAsset ? activeTrade : null

  const highLow = useMemo(() => {
    const values = ticks.slice(-60).map((tick) => tick.value)
    return { high: Math.max(...values), low: Math.min(...values) }
  }, [ticks])

  return (
    <div className="trade-page">
      <section className="market panel">
        <div className="market-header">
          <div className="asset-switcher">
            <button className="terminal-add" aria-label="Add dataset"><Plus /></button>
            {(Object.keys(ASSETS) as Array<keyof typeof ASSETS>).map((id) => (
              <button
                key={id}
                className={selectedAsset === id ? 'active' : ''}
                onClick={() => selectAsset(id)}
              >
                {id === 'BTCUSD' ? <Bitcoin size={19} /> : <span className="eth-mark">◆</span>}
                <span><strong>{ASSETS[id].symbol}</strong><small>{ASSETS[id].name}</small></span>
              </button>
            ))}
          </div>
          <button className="market-status"><span /> Simulation active <ChevronDown size={15} /></button>
        </div>
        <div className="quote-row">
          <div>
            <p className="eyebrow">Current value</p>
            <strong className="current-price">{money.format(current)}</strong>
            <span className={`price-change ${positive ? 'positive' : 'negative'}`}>
              {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              {Math.abs(change).toFixed(2)}%
            </span>
          </div>
          <dl className="market-stats">
            <div><dt>Max</dt><dd>{money.format(highLow.high)}</dd></div>
            <div><dt>Min</dt><dd>{money.format(highLow.low)}</dd></div>
          </dl>
        </div>
        <div className="chart-stage">
          <div className="chart-tools" aria-label="Chart tools">
            <button className="active">5s</button>
            <button aria-label="Candlestick chart"><CandlestickChart /></button>
            <button aria-label="Signals"><Radio /></button>
          </div>
          <PriceChart ticks={ticks} activeTrade={chartTrade} />
        </div>
      </section>
      <TradeControls />
      <TradeHistory />
      <EventLog />
    </div>
  )
}
