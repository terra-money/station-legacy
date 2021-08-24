import { Dictionary } from 'ramda'
import { API, DisplayCoin, DisplayCoinDictionary, Options } from '..'

export interface DashboardPage extends API<DashboardData> {
  ui: DashboardUI
}

export interface DashboardUI {
  prices: PricesUI
  taxRate: TaxRateUI
  issuance: DisplaySelector
  communityPool: DisplaySelector
  stakingRatio: StakingRatioUI
}

export interface PricesUI {
  title: string
  display: DisplayCoin
}

export interface TaxRateUI {
  title: string
  content: string
  desc: string
}

export interface DisplaySelector {
  title: string
  select: { defaultValue: string; options: Options }
  displays: DisplayCoinDictionary
}

export interface StakingRatioUI {
  title: string
  content: string
  small: string
  desc: string
}

/* data */
export interface DashboardData {
  prices: Dictionary<string>
  taxRate: string
  taxCaps: TaxCap[]
  issuances: Dictionary<string>
  communityPool: Dictionary<string>
  stakingPool: StakingPool
}

export interface TaxCap {
  denom: string
  taxCap: string
}

export interface StakingPool {
  stakingRatio: string
  bondedTokens: string
  notBondedTokens: string
}
