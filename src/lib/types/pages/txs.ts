import { API, CoinItem, Card } from '..'

export interface TxsPage extends API<TxsData> {
  ui?: TxsUI
}

export interface TxsUI {
  card?: Card
  list?: TxUI[]
  more?: () => void
}

export interface TxUI {
  link: string
  hash: string
  date: string
  messages: MessageUI[]
  details: Card[]
}

export interface MessageUI {
  tag: string
  summary: string[]
  success: boolean
}

/* data */
export interface TxsData {
  txs: Tx[]
}

export interface Tx {
  id: number
  height: number
  timestamp: string
  txhash: string
  chainId: string
  tx: {
    type: string
    value: TxValue
  }
  raw_log: string
}

export interface TxValue {
  fee: { gas: string; amount: { amount: string; denom: string }[] }
  memo: string
  msg: { type: string; value: any }[]
}

export interface Message {
  tag: string
  text: string
  out?: CoinItem[]
}
