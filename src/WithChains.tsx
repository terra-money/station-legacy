import { FC } from 'react'
import { NetworkInfo, WalletProvider } from '@terra-money/wallet-provider'
import { useInitChains } from './pages/settings/useMergedChains'

const WithChains: FC = ({ children }) => {
  const chains = useInitChains()

  const walletConnectChainIds: Record<number, NetworkInfo> = {
    0: chains['testnet'],
    1: chains['mainnet'],
  }

  return !Object.keys(chains).length ? null : (
    <WalletProvider
      defaultNetwork={chains['mainnet']}
      walletConnectChainIds={walletConnectChainIds}
    >
      {children}
    </WalletProvider>
  )
}

export default WithChains
