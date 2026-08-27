/**
 * Result popup for a finished simulation with an optional random-trade retry.
 *
 * Mounted once by `App`; it appears whenever the store holds a `lastResult`
 * and closes through `dismissTradeResult()` (button, Escape, or backdrop).
 */
import { useEffect, useRef } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  RotateCw,
  TrendingDown,
  Trophy,
} from 'lucide-react'
import { ASSETS } from '../../shared/config'
import { useTradingStore } from './store'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const RESULT_COPY = {
  win: { eyebrow: 'Simulation successful', title: 'Your prediction was right', Icon: Trophy },
  loss: { eyebrow: 'Simulation completed', title: 'The value went the other way', Icon: TrendingDown },
  draw: { eyebrow: 'No change', title: 'The value stayed the same', Icon: Minus },
} as const

export function TradeResultModal() {
  const lastResult = useTradingStore((state) => state.lastResult)
  const dismissTradeResult = useTradingStore((state) => state.dismissTradeResult)
  const retryRandomTrade = useTradingStore((state) => state.retryRandomTrade)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lastResult) return
    dialogRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismissTradeResult()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lastResult, dismissTradeResult])

  if (!lastResult) return null

  const result = lastResult.result ?? 'draw'
  const { eyebrow, title, Icon } = RESULT_COPY[result]
  const net = (lastResult.payout ?? 0) - lastResult.amount
  const asset = ASSETS[lastResult.assetId]

  return (
    <div className="result-backdrop" onClick={dismissTradeResult}>
      <div
        ref={dialogRef}
        className={`result-modal ${result}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="result-badge"><Icon /></div>
        <p className="result-eyebrow">{eyebrow}</p>
        <h2 id="result-title">{title}</h2>
        <strong className={`result-net ${result}`}>
          {net > 0 ? `+${money.format(net)}` : net < 0 ? `−${money.format(Math.abs(net))}` : money.format(0)}
        </strong>

        <dl className="result-figures">
          <div>
            <dt>Dataset</dt>
            <dd>
              {asset.symbol}
              <span className={`direction-pill ${lastResult.direction}`}>
                {lastResult.direction === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {lastResult.direction === 'up' ? 'Higher' : 'Lower'}
              </span>
            </dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>{money.format(lastResult.amount)} · {lastResult.duration} sec</dd>
          </div>
          <div>
            <dt>Start value</dt>
            <dd>{money.format(lastResult.openPrice)}</dd>
          </div>
          <div>
            <dt>Final value</dt>
            <dd>{money.format(lastResult.closePrice ?? lastResult.openPrice)}</dd>
          </div>
          <div>
            <dt>Returned</dt>
            <dd>{money.format(lastResult.payout ?? 0)}</dd>
          </div>
        </dl>

        <div className="result-actions">
          {lastResult.randomized && (
            <button className="result-retry" onClick={retryRandomTrade}><RotateCw />Попробовать еще раз</button>
          )}
          <button className="result-close" onClick={dismissTradeResult}>Continue</button>
        </div>
      </div>
    </div>
  )
}
