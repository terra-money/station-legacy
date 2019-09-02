interface Dashboard {
  prices: Prices
  taxRate: string
  taxCaps: TaxCap[]
  issuances: Issuances
  stakingPool: StakingPool
}

interface Issuances {
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
