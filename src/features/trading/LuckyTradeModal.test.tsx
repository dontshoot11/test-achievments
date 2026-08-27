import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { LuckyTradeModal } from './LuckyTradeModal'
import { useTradingStore } from './store'

describe('lucky trade popup', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    useTradingStore.getState().resetDemo()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  const finishSpin = () => act(() => vi.advanceTimersByTime(3_000))

  it('shows the generated duration, amount, and direction', () => {
    useTradingStore.setState({ randomTradeDraft: { duration: 10, amount: 250, direction: 'up' } })
    render(<LuckyTradeModal />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('10 сек')).toBeInTheDocument()
    expect(screen.getByText('$250')).toBeInTheDocument()
    expect(screen.getByText('Выше')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Крутятся…' })).toBeDisabled()
  })

  it('opens the trade only when Открыть is selected', () => {
    useTradingStore.setState({ randomTradeDraft: { duration: 5, amount: 100, direction: 'down' } })
    render(<LuckyTradeModal />)

    expect(useTradingStore.getState().activeTrade).toBeNull()
    expect(screen.queryByRole('button', { name: 'Открыть' })).not.toBeInTheDocument()
    finishSpin()
    fireEvent.click(screen.getByRole('button', { name: 'Открыть' }))

    expect(useTradingStore.getState().activeTrade).toMatchObject({ duration: 5, amount: 100, direction: 'down' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes without opening a trade', () => {
    useTradingStore.setState({ randomTradeDraft: { duration: 5, amount: 100, direction: 'down' } })
    render(<LuckyTradeModal />)
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }))

    expect(useTradingStore.getState().randomTradeDraft).toBeNull()
    expect(useTradingStore.getState().activeTrade).toBeNull()
  })

  it('edits the generated settings inside the popup', () => {
    useTradingStore.setState({ randomTradeDraft: { duration: 10, amount: 240, direction: 'up' } })
    render(<LuckyTradeModal />)
    finishSpin()
    fireEvent.click(screen.getByRole('button', { name: 'Редактировать' }))
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Сумма сделки' }), { target: { value: '320' } })
    fireEvent.click(screen.getByRole('button', { name: '5 сек' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ниже' }))

    const state = useTradingStore.getState()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(state.randomTradeDraft).toEqual({ amount: 320, duration: 5, direction: 'down' })
    expect(state.activeTrade).toBeNull()
  })

  it('generates new settings and spins the reels again', () => {
    useTradingStore.setState({ randomTradeDraft: { duration: 5, amount: 100, direction: 'up' } })
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.99)
    render(<LuckyTradeModal />)
    finishSpin()

    fireEvent.click(screen.getByRole('button', { name: /Еще раз/ }))

    expect(useTradingStore.getState().randomTradeDraft).toEqual({ duration: 10, amount: 500, direction: 'down' })
    expect(screen.getByRole('button', { name: 'Крутятся…' })).toBeDisabled()
    random.mockRestore()
  })
})
