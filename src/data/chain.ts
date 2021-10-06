import { useCallback, useEffect } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { useConnectedWallet } from '@terra-money/wallet-provider'
import { ChainOptions, fcd } from '../lib'
import { localSettings } from '../utils/localStorage'
import useMergedChains from '../pages/settings/useMergedChains'

const chainNameState = atom({
  key: 'chainNameState',
  default: localSettings.get().chain ?? 'mainnet',
})

export const useCurrentChain = () => {
  const chains = useMergedChains()
  const currentChainName = useRecoilValue(chainNameState)
  const connectedWallet = useConnectedWallet()

  if (connectedWallet) return connectedWallet.network as ChainOptions

  const chain = chains[currentChainName]
  const adjustedChain = chain ?? chains['mainnet']

  return adjustedChain
}

export const useCurrentChainName = () => {
  const { name } = useCurrentChain()
  return name
}

export const useChainID = () => {
  const { chainID } = useCurrentChain()
  return chainID
}

export const useManageChain = () => {
  const setChainName = useSetRecoilState(chainNameState)
  const currentChain = useCurrentChain()
  const connected = useConnectedWallet()

  const set = useCallback(
    (chain: ChainOptions) => {
      const { lcd } = chain
      fcd.defaults.baseURL = lcd.replace('lcd', 'fcd')
      localSettings.set({ chain: chain.name })
      setChainName(chain.name)
    },
    [setChainName]
  )

  // On init
  useEffect(() => {
    set(currentChain)
  }, [currentChain, set])

  // On connect wallet-provider
  useEffect(() => {
    if (connected) {
      set(connected.network as ChainOptions)
    }
  }, [connected, set])

  return { set }
}
