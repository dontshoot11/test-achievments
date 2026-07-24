import { ASSETS } from '../../shared/config'
import type { AssetId, Tick } from '../../shared/types'

export const nextRandom = (seed: number) => {
  const nextSeed = (seed * 1_664_525 + 1_013_904_223) >>> 0
  return { seed: nextSeed, value: nextSeed / 4_294_967_296 }
}

export const createHistory = (assetId: AssetId, count = 80): Tick[] => {
  const asset = ASSETS[assetId]
  let price = asset.startPrice
  let seed = assetId === 'BTCUSD' ? 84_021 : 19_971
  const now = Math.floor(Date.now() / 1000)

  return Array.from({ length: count }, (_, index) => {
    const random = nextRandom(seed)
    seed = random.seed
    const wave = Math.sin(index / 7) * asset.volatility * 0.35
    price *= 1 + (random.value - 0.48) * asset.volatility + wave
    return { time: now - count + index, value: Number(price.toFixed(asset.decimals)) }
  })
}

export const createNextTick = (
  assetId: AssetId,
  previous: Tick,
  seed: number,
  time = Date.now(),
) => {
  const asset = ASSETS[assetId]
  const random = nextRandom(seed)
  const momentum = (random.value - 0.495) * asset.volatility
  const value = Number((previous.value * (1 + momentum)).toFixed(asset.decimals))
  return {
    seed: random.seed,
    tick: { time: Math.floor(time / 1000), value },
  }
}
