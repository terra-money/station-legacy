import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { without } from 'ramda'
import extension from 'extensionizer'
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider'
import { localSettings } from '../utils/localStorage'
import { isExtension } from '../utils/env'
import * as ledger from '../wallet/ledger'
import { useAuthModal } from '../auth/useAuthModal'

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
  const { disconnect } = useWallet()
  const { replace } = useHistory()

  // Store user on connect wallet-provider
  useEffect(() => {
    if (connectedWallet) {
      const { terraAddress } = connectedWallet
      setUser({ address: terraAddress, provider: true })
    }
  }, [connectedWallet, setUser])

  // On sign in
  useEffect(() => {
    if (user) {
      const { address } = user

      addToRecentAddress(address)
      authModal.close()
      localSettings.set({ user })
      extension.storage?.local.set({ wallet: { address } })

      if (isExtension) {
        replace('/')
        // Close connection to Ledger. It is not allowed to be accessed from multiple tabs.
        user.ledger && ledger.close()
      }
    }

    // eslint-disable-next-line
  }, [user])

  // On sign out
  const signOut = () => {
    disconnect()
    setUser(undefined)
    localSettings.delete(['user'])
    extension.storage?.local.remove(['wallet'])
  }

  return { signIn: setUser, signOut }
}

const addToRecentAddress = (address: string) => {
  const { recentAddresses = [] } = localSettings.get()
  const next = [address, ...without([address], recentAddresses)]
  localSettings.set({ recentAddresses: next })
}
