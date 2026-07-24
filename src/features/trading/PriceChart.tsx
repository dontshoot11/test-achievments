import { useEffect, useRef } from 'react'
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts'
import type { Tick, Trade } from '../../shared/types'

interface PriceChartProps {
  ticks: Tick[]
  activeTrade: Trade | null
}

export function PriceChart({ ticks, activeTrade }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#66718a',
        fontFamily: 'Inter, system-ui, sans-serif',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,.035)' },
        horzLines: { color: 'rgba(255,255,255,.035)' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: true },
    })
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#28c76f',
      downColor: '#ff5869',
      borderUpColor: '#28c76f',
      borderDownColor: '#ff5869',
      wickUpColor: '#28c76f',
      wickDownColor: '#ff5869',
      priceLineVisible: true,
      lastValueVisible: true,
    })
    chartRef.current = chart
    seriesRef.current = series
    return () => chart.remove()
  }, [])

  useEffect(() => {
    seriesRef.current?.setData(
      ticks.map((tick, index) => {
        const open = index === 0 ? tick.value : ticks[index - 1].value
        const close = tick.value
        const body = Math.abs(close - open)
        const wick = Math.max(body * 0.45, close * 0.00008)
        const variation = 0.75 + (index % 4) * 0.12
        return {
          time: tick.time as UTCTimestamp,
          open,
          high: Math.max(open, close) + wick * variation,
          low: Math.min(open, close) - wick * (1.3 - variation / 2),
          close,
        }
      }),
    )
  }, [ticks])

  useEffect(() => {
    const series = seriesRef.current
    if (!series) return
    const lines = series.priceLines()
    lines.forEach((line) => series.removePriceLine(line))
    if (activeTrade) {
      series.createPriceLine({
        price: activeTrade.openPrice,
        color: '#ffd166',
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'Start',
      })
    }
  }, [activeTrade])

  return <div ref={containerRef} className="price-chart" aria-label="Dataset value chart" />
}
