import {
  useConnectedWallet,
  useWallet,
  WalletStatus,
} from '@terra-money/wallet-provider'
import extension from 'extensionizer'
import { without } from 'ramda'
import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { useAuthModal } from '../auth/useAuthModal'
import { isExtension } from '../utils/env'
import { localSettings } from '../utils/localStorage'
import * as ledger from '../wallet/ledger'

const userState = atom({
  key: 'userState',
  default: localSettings.get().user,
})

export const useUser = () => {
  return useRecoilValue(userState)
}

export const useAddress = () => {
  const user = useRecoilValue(userState)
  return user?.address ?? ''
}

export const useAuth = () => {
  const authModal = useAuthModal()
  const [user, setUser] = useRecoilState(userState)
  const connectedWallet = useConnectedWallet()
  const { status, disconnect } = useWallet()
  const { replace } = useHistory()

  // Store user on connect wallet-provider
  useEffect(() => {
    if (connectedWallet) {
      const { terraAddress } = connectedWallet
      setUser({ address: terraAddress, provider: true })
    }
  }, [connectedWallet, setUser])

  // Remove user on disconnect wallet-provider
  useEffect(() => {
    if (
      status === WalletStatus.WALLET_NOT_CONNECTED &&
      user?.provider === true
    ) {
      setUser(undefined)
      localSettings.delete(['user'])
      extension.storage?.local.remove(['wallet'])
    }
  }, [setUser, status, user?.provider])

  // On sign in
  useEffect(() => {
    if (user) {
      const { address } = user

      addToRecentAddress(address)
      localSettings.set({ user })
      extension.storage?.local.set({ wallet: { address } })
    }

    // eslint-disable-next-line
  }, [user])

  const signIn = (user: User) => {
    setUser(user)
    authModal.close()

    if (isExtension) {
      replace('/')

      // Close connection to Ledger. It is not allowed to be accessed from multiple tabs.
      user.ledger && ledger.close()
    }
  }

  // On sign out
  const signOut = useCallback(() => {
    disconnect()
    setUser(undefined)
    localSettings.delete(['user'])
    extension.storage?.local.remove(['wallet', 'encrypted', 'timestamp'])
  }, [disconnect, setUser])

  return { signIn, signOut }
}

const addToRecentAddress = (address: string) => {
  const { recentAddresses = [] } = localSettings.get()
  const next = [address, ...without([address], recentAddresses)]
  localSettings.set({ recentAddresses: next })
}
