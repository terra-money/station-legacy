import { Token, ContractInfo, NFTToken } from '../pages/assets'

export type Denom = string

export interface CoinItem {
  amount: string
  denom: string
}

export interface DisplayCoin {
  value: string
  unit: string
}
export interface NFTDisplay {
  token_id: string
  name?: string
  img_url?: string
}
export interface NFTDisplayCoin extends DisplayCoin {
  owned?: NFTDisplay[]
}

export type DisplayCoinDictionary = Dictionary<DisplayCoin>
export type Whitelist = Dictionary<Token>
export type NFTWhitelist = Dictionary<NFTToken>
export type Contracts = Dictionary<ContractInfo>
export type Pair = [string, string]
export type Pairs = Dictionary<Pair>
