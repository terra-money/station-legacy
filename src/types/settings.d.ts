interface User {
  address: string
  name?: strings
  ledger?: boolean
  wallet?: string
}

interface Settings {
  lang?: string
  currency?: string
  chain?: string
  user?: User
  recentAddresses?: string[]
  hideSmallBalances?: boolean
  customNetworks?: CustomNetwork[]
}

interface CustomNetwork {
  name: string
  chainID: string
  lcd: string
  fcd: string
  ws: string
}
