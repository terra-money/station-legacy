import { API, Filter, DisplayCoin, Point } from '..'

export interface MarketPage extends API<OracleData> {
  swap: string
  ui?: MarketUI
}

export interface MarketUI {
  actives: string[]
}

export interface Variation {
  amount: number
  value: string
  percent: string
}

/* price */
export interface PricePage extends API<PriceData> {
  title: string
  filter: { interval: Filter }
  ui?: PriceUI
}

export interface PriceUI {
  price: number
  unit: string
  variation: Variation
  chart: { data?: Point[]; message?: string }
}

/* rate */
export interface RatePage extends API<Rate[]> {
  title: string
  filter: { denom: Filter }
  unit?: string
  message?: string
  ui?: RateUI
}

export interface RateUI {
  list?: RateItem[]
  message?: string
}

export interface RateItem {
  variation: Variation
  display: DisplayCoin
}

/* data */
export interface OracleData {
  result: string[]
}

export interface OneDayVariation {
  oneDayVariation: string
  oneDayVariationRate: string
}

/* data: price */
export interface PriceData extends OneDayVariation {
  lastPrice?: number
  prices?: Price[]
}

export interface Price {
  denom: string
  datetime: number
  price: number
}

/* data: rate */
export interface Rate extends OneDayVariation {
  denom: string
  swaprate: string
}
