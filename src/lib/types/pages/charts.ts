import { DisplayCoin, Filter, Point } from '..'

export type ChartKey =
  | 'TxVolume'
  | 'StakingReturn'
  | 'TaxRewards'
  | 'TotalAccounts'

export enum CumulativeType {
  C = 'cumulative',
  P = 'periodic',
}

export enum AccountType {
  A = 'active',
  T = 'total',
}

export interface ChartCard {
  title: string
  desc: string
  filter: ChartFilter
  value?: DisplayCoin | [string, string]
  chart?: ChartUI
}

export interface ChartFilter {
  type?: Filter<CumulativeType>
  denom?: Filter
  account?: Filter<AccountType>
  duration: Filter
}

export interface ChartUI {
  data: Point[]
  tooltips: { title: string; label: string }[]
}
