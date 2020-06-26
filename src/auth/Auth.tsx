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

export interface Item {
  title: string
  icon: string
  disabled?: boolean
  key: AuthMenuKey
  render: () => ReactNode
}

const getAuthMenuKeys = (): AuthMenuKey[] => {
  if (isElectron) {
    const version: string = electron('version')

    if (semver.lt(version, ledger.REQUIRED_ELECTRON_APP_VERSION)) {
      return ['signIn', 'signUp', 'recover']
    }

    return ['signInWithLedger', 'signIn', 'signUp', 'recover']
  }

  return ['signInWithLedger']
}

const Auth = () => {
  const components: { [key in AuthMenuKey]: Omit<Item, 'title' | 'key'> } = {
    recover: {
      icon: 'settings_backup_restore',
      render: () => <Recover />,
    },
    signUp: {
      icon: 'person_add',
      render: () => <SignUp />,
    },
    signIn: {
      icon: 'lock',
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
    Object.assign({}, { title: label, key }, components[key])

  const handleClick = () => setCurrentKey('signInWithAddress')

  return currentKey ? (
    <AuthModalProvider value={modalActions}>
      {components[currentKey]['render']()}
    </AuthModalProvider>
  ) : (
    <ModalContent close={modalActions.close}>
      <AuthMenu list={list.map(getItem)} onSelect={setCurrentKey} />
      {!isElectron && <AuthFooter {...ui.web} onClick={handleClick} />}
    </ModalContent>
  )
}

export default Auth
