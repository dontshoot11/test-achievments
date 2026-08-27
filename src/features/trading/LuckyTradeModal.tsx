/**
 * Slot-machine preview for generating, rerolling, editing, and confirming a random trade.
 * Mount once alongside the trading routes; visibility is controlled by the store draft.
 */
import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Clock3, Coins, Dices, RotateCw, X } from 'lucide-react'
import { useTradingStore } from './store'

export function LuckyTradeModal() {
  const draft = useTradingStore((state) => state.randomTradeDraft)
  const confirm = useTradingStore((state) => state.confirmRandomTrade)
  const updateDraft = useTradingStore((state) => state.updateRandomTradeDraft)
  const reroll = useTradingStore((state) => state.rerollRandomTrade)
  const dismiss = useTradingStore((state) => state.dismissRandomTrade)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [spinning, setSpinning] = useState(true)
  const [editing, setEditing] = useState(false)
  const [spinCycle, setSpinCycle] = useState(0)
  const isOpen = Boolean(draft)

  useEffect(() => {
    if (!isOpen) return
    setSpinning(true)
    setEditing(false)
    dialogRef.current?.focus()
    const spinTimer = window.setTimeout(() => setSpinning(false), 3_000)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(spinTimer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, dismiss, spinCycle])

  const handleReroll = () => {
    reroll()
    setSpinCycle((value) => value + 1)
  }

  if (!draft) return null

  return (
    <div className="lucky-backdrop" onClick={dismiss}>
      <div
        ref={dialogRef}
        className="lucky-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lucky-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="lucky-dismiss" onClick={dismiss} aria-label="Закрыть"><X /></button>
        <div className="lucky-marquee"><Dices /> Случайная сделка <Dices /></div>
        <h2 id="lucky-title">Случайный выбор готов</h2>
        <p>{spinning ? 'Барабаны выбирают параметры сделки…' : 'Барабаны остановились. Проверьте параметры перед открытием.'}</p>
        <div className={`lucky-reels ${spinning ? 'spinning' : ''}`} aria-busy={spinning}>
          <div className="lucky-reel">
            <small>Продолжительность</small>
            {editing ? <div className="lucky-options">{([5, 10] as const).map((value) => <button key={value} className={draft.duration === value ? 'active' : ''} onClick={() => updateDraft({ duration: value })}>{value} сек</button>)}</div> : <span><Clock3 />{draft.duration} сек</span>}
          </div>
          <div className="lucky-reel">
            <small>Сумма</small>
            {editing ? <label className="lucky-amount"><Coins /><span>$</span><input aria-label="Сумма сделки" type="number" min="10" max="500" step="10" value={draft.amount} onChange={(event) => updateDraft({ amount: Math.max(10, Math.min(500, Number(event.target.value))) })} /></label> : <span><Coins />${draft.amount}</span>}
          </div>
          <div className={`lucky-reel ${draft.direction}`}>
            <small>Направление</small>
            {editing ? <div className="lucky-options"><button className={draft.direction === 'up' ? 'active up' : ''} onClick={() => updateDraft({ direction: 'up' })}>Выше</button><button className={draft.direction === 'down' ? 'active down' : ''} onClick={() => updateDraft({ direction: 'down' })}>Ниже</button></div> : <span>{draft.direction === 'up' ? <ArrowUpRight /> : <ArrowDownRight />}{draft.direction === 'up' ? 'Выше' : 'Ниже'}</span>}
          </div>
        </div>
        <div className="lucky-actions">
          <button className="lucky-edit" onClick={() => setEditing((value) => !value)} disabled={spinning}>{editing ? 'Готово' : 'Редактировать'}</button>
          <button className="lucky-reroll" onClick={handleReroll} disabled={spinning}><RotateCw />Еще раз</button>
          <button className="lucky-open" onClick={confirm} disabled={spinning}>
            {spinning ? 'Крутятся…' : 'Открыть'}
          </button>
        </div>
      </div>
    </div>
  )
}
