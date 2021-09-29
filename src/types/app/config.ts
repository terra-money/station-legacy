export interface Config {
  lang: LangConfig
  currency: CurrencyConfig
  chain: ChainConfig
}

export interface InitialConfigState {
  lang?: LangKey
  currency?: string
  chain: ChainOptions
}

/* lang */
export type LangKey = 'en' | 'es' | 'zh' | 'fr' | 'ru' | 'pl'

export interface LangConfig {
  current?: LangKey
  list: LangKey[]
  set: (key: LangKey) => void
}

/* currency */
export interface CurrencyItem {
  key: string
  value: string
  krwRate: string
}

export interface CurrencyConfig {
  current?: CurrencyItem
  list?: CurrencyItem[]
  loading: boolean
  set: (key: string) => void
}

/* chain */
export interface DefaultChainOptions {
  name: string
  chainID: string
  lcd: string
}

export interface ChainOptions extends DefaultChainOptions {
  fcd: string
  localterra?: boolean
}

export interface ChainConfig {
  current: ChainOptions
  set: (options: ChainOptions) => void
}

export interface HeightData {
  formatted: string
  link: string
}
