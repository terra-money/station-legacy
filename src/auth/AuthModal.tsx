import { useState } from 'react'
import { ConnectType, useWallet } from '@terra-money/wallet-provider'
import { AuthMenuKey, useAuthMenu } from '../lib'
import { isElectron, isWeb } from '../utils/env'
import { loadKeys } from '../utils/localStorage'
import { useApp } from '../hooks'
import ModalContent from '../components/ModalContent'
import { menu } from './getAuthMenu'
import getAuthMenuKeys from './getAuthMenuKeys'
import AuthMenu from './AuthMenu'
import AuthFooter from './AuthFooter'

const AuthModal = () => {
  const { authModal } = useApp()
  const [currentKey, setCurrentKey] = useState<AuthMenuKey>()

  const actions = {
    glance: () => setCurrentKey('signInWithAddress'),
    download: () => setCurrentKey('download'),
  }

  const keys: AuthMenuKey[] = getAuthMenuKeys()
  const { ui, list } = useAuthMenu(keys)

  const { availableConnectTypes, availableInstallTypes, connect, install } =
    useWallet()

  const defaultList = list.map(({ label, key }) => {
    const item = menu[key]
    return Object.assign(
      {
        title: label,
        disabled: key === 'signIn' && !loadKeys().length,
        onClick: () => setCurrentKey(key),
        key,
      },
      item
    )
  })

  const walletProviderList = ([] as any)
    .concat(
      availableInstallTypes.includes(ConnectType.CHROME_EXTENSION)
        ? {
            title: 'Terra Station Extension',
            icon: 'extension',
            onClick: () => install(ConnectType.CHROME_EXTENSION),
          }
        : []
    )
    .concat(
      availableConnectTypes.includes(ConnectType.WEBEXTENSION)
        ? {
            title: 'Terra Station Extension',
            icon: 'extension',
            onClick: () => connect(ConnectType.WEBEXTENSION),
          }
        : availableConnectTypes.includes(ConnectType.CHROME_EXTENSION)
        ? {
            title: 'Terra Station Extension',
            icon: 'extension',
            onClick: () => connect(ConnectType.CHROME_EXTENSION),
          }
        : []
    )
    .concat(
      availableConnectTypes.includes(ConnectType.WALLETCONNECT)
        ? {
            title: 'Terra Station Mobile',
            icon: 'smartphone',
            onClick: () => connect(ConnectType.WALLETCONNECT),
          }
        : []
    )

  const authMenuList = (isWeb ? walletProviderList : []).concat(defaultList)

  /* Modal */
  const modalActions = {
    close: authModal.close,
    goBack: currentKey && (() => setCurrentKey(undefined)),
  }

  const footer = !isElectron && <AuthFooter {...ui.web} actions={actions} />

  return (
    <ModalContent {...modalActions}>
      {!currentKey ? (
        <AuthMenu list={authMenuList} footer={footer} />
      ) : (
        menu[currentKey].render()
      )}
    </ModalContent>
  )
}

export default AuthModal
