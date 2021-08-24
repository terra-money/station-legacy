import { Coin, Field, ButtonAttrs } from '..'

export interface CoinInput {
  denom: string
  input: string
}

export interface CoinInputGroup {
  denom: Field
  input: Field
  button?: ButtonAttrs
}

export interface CoinFields {
  label: string
  groups: CoinInputGroup[]
  coins: Coin[]
  invalid: boolean
}

export interface QueryResult {
  title: string
  label: string
  content: string
}
