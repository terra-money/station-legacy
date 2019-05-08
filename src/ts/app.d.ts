type Electron = <T>(channel: string, arg?: any) => T

interface Version {
  version: string
  macUrl: string
  windowsUrl: string
  linuxUrl: string
  title: string
  message: string
  forceUpdate: boolean
}

interface Wallet {
  privateKey: string
  publicKey: string
  terraAddress: string
}

interface Pagination {
  totalCnt: number
  page: number
  limit: number
}

interface Tab {
  label: string
  key: 'amountDelegated' | 'totalReward'
}
