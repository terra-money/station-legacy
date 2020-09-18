import React, { ReactNode, useState } from 'react'
import { useAuthMenu } from '@terra-money/use-station'
import { AuthMenuKey, AuthMenuItem } from '@terra-money/use-station'
import semver from 'semver'
import { isElectron } from '../utils/env'
import { electron } from '../utils'
import { loadKeys } from '../utils/localStorage'
import { useApp } from '../hooks'
import ModalContent from '../components/ModalContent'
import { AuthModalProvider } from './useAuthModal'
import AuthMenu from './AuthMenu'
import AuthFooter from './AuthFooter'
import Recover from './Recover'
import SignUp from './SignUp'
import SignIn from './SignIn'
import SignInWithAddress from './SignInWithAddress'
import SignInWithLedger from './SignInWithLedger'
import ledger from '../wallet/ledger'
import Download from './Download'

const getAuthMenuKeys = (): AuthMenuKey[] => {
  if (isElectron) {
    const version: string = electron('version')

    if (semver.lt(version, ledger.REQUIRED_ELECTRON_APP_VERSION)) {
      return ['signIn', 'signUp', 'recover']
    }

    return ['signInWithLedger', 'signIn', 'signUp', 'recover']
  }

  return ['signInWithLedger', 'download']
}

export interface Item {
  title: string
  icon: string
  disabled?: boolean
  key: AuthMenuKey
  render: () => ReactNode
}

const Auth = () => {
  const components: { [key in AuthMenuKey]: Omit<Item, 'title' | 'key'> } = {
    recover: {
      icon: 'settings_backup_restore',
      render: () => <Recover />,
    },
    signUp: {
      icon: 'add_circle_outline',
      render: () => <SignUp />,
    },
    signIn: {
      icon: 'radio_button_checked',
      disabled: !loadKeys().length,
      render: () => <SignIn />,
    },
    signInWithAddress: {
      icon: 'account_balance_wallet',
      disabled: true,
      render: () => <SignInWithAddress />,
    },
    signInWithLedger: {
      icon: 'usb',
      render: () => <SignInWithLedger />,
    },
    download: {
      icon: 'cloud_download',
      render: () => <Download />,
    },
  }

  const keys: AuthMenuKey[] = getAuthMenuKeys()
  const { ui, list } = useAuthMenu(keys)
  const { authModal } = useApp()
  const [currentKey, setCurrentKey] = useState<AuthMenuKey>()

  /* Modal */
  const modalActions = {
    close: authModal.close,
    goBack: () => setCurrentKey(undefined),
  }

  /* render */
  const getItem = ({ label, key }: AuthMenuItem) =>
    Object.assign(
      { title: label, onClick: () => setCurrentKey(key), key },
      components[key]
    )

  const glance = () => setCurrentKey('signInWithAddress')
  const download = () => setCurrentKey('download')

  return currentKey ? (
    <AuthModalProvider value={modalActions}>
      {components[currentKey]['render']()}
    </AuthModalProvider>
  ) : (
    <ModalContent close={modalActions.close}>
      <AuthMenu list={list.map(getItem)} />
      {!isElectron && (
        <AuthFooter
          {...ui.web}
          onClickGlance={glance}
          onClickDownload={download}
        />
      )}
    </ModalContent>
  )
}

export default Auth
