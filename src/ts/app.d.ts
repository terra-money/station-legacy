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

interface VersionWeb {
  version: string
  title: string
  content: string
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

interface Modal {
  open: (content?: ReactNode, config?: object) => void
  close: () => void
  setContent: Dispatch<SetStateAction<ReactNode>>
  prevent: (prevent: boolean) => void
  content: ReactNode
  config: ReactModal.Props & { onRequestClose: () => void }
}

interface Settings {
  address?: string
  withLedger?: boolean
  recentAddresses?: string[]
  lang?: string
  chain?: string
  hideSmallBalances?: boolean
}
