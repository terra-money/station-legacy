import { API, Coin, Card } from '..'

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
  text: string
  success: boolean
}

/* data */
export interface TxsData {
  txs: Tx[]
}

export interface Tx {
  id: number
  timestamp: string
  txhash: string
  msgs: Message[]
  txFee: Coin[]
  memo: string
  success: boolean
  errorMessage: string
  chainId: string
}

export interface Message {
  tag: string
  text: string
  out?: Coin[]
}
