import { DisplayCoin } from '..'
import { Field } from '../common/form'
import { BankData } from '../data/bank'
import { Pairs } from '../data/coin'

export interface SwapUI {
  bank?: BankData
  pairs?: Pairs
  mode: string
  message: string
  expectedPrice?: {
    title: string
    text: string
  }
  max?: {
    title: string
    display: DisplayCoin
    attrs: { onClick: () => void }
  }
  spread?: {
    title: string
    text?: string
    value?: string
    unit?: string
    tooltip?: string
  }
  label: {
    multipleSwap: string
  }
  slippageField: Field
}
