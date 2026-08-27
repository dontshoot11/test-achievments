import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { TradeResultModal } from './TradeResultModal'
import { useTradingStore } from './store'
import type { Trade } from '../../shared/types'

const finishedTrade: Trade = {
  id: 'trade-1',
  assetId: 'ETHUSD',
  direction: 'down',
  amount: 200,
  duration: 10,
  openPrice: 3_500,
  openedAt: 0,
  expiresAt: 10_000,
  closePrice: 3_400,
  result: 'win',
  payout: 360,
}

describe('trade result popup', () => {
  beforeEach(() => {
    localStorage.clear()
    useTradingStore.getState().resetDemo()
  })

  afterEach(cleanup)

  it('stays hidden while there is no finished simulation', () => {
    render(<TradeResultModal />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the outcome, net change, and prices of the finished simulation', () => {
    useTradingStore.setState({ lastResult: finishedTrade })
    render(<TradeResultModal />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Simulation successful')).toBeInTheDocument()
    expect(screen.getByText('+$160.00')).toBeInTheDocument()
    expect(screen.getByText('$3,500.00')).toBeInTheDocument()
    expect(screen.getByText('$3,400.00')).toBeInTheDocument()
    expect(screen.getByText('$360.00')).toBeInTheDocument()
  })

  it('closes when Continue is selected', () => {
    useTradingStore.setState({ lastResult: finishedTrade })
    render(<TradeResultModal />)

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(useTradingStore.getState().lastResult).toBeNull()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
