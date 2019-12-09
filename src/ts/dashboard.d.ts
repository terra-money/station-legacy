interface Dashboard {
  prices: Prices
  taxRate: string
  taxCaps: TaxCap[]
  issuances: CoinMap
  communityPool: CoinMap
  stakingPool: StakingPool
}

interface CoinMap {
  [denom: string]: string
}

interface Prices {
  ukrw: string
}

interface StakingPool {
  stakingRatio: string
  bondedTokens: string
  notBondedTokens: string
}

interface TaxCap {
  denom: string
  taxCap: string
}
