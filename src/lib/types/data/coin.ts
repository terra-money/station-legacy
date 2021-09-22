import { Token, ContractInfo } from '../pages/assets'

export type Denom = string

export interface CoinItem {
  amount: string
  denom: string
}

export interface DisplayCoin {
  value: string
  unit: string
}

export type DisplayCoinDictionary = Dictionary<DisplayCoin>
export type Whitelist = Dictionary<Token>
export type Contracts = Dictionary<ContractInfo>
export type Pair = [string, string]
export type Pairs = Dictionary<Pair>
