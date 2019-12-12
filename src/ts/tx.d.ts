interface Tx {
  timestamp: string
  txhash: string
  msgs: Message[]
  txFee: Coins
  memo: string
  success: boolean
  errorMessage: string
  chainId: string
}

interface Message {
  tag: string
  text: string
}
