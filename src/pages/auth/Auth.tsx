import React, { useState, createContext, ReactNode } from 'react'
import { isElectron } from '../../helpers/env'
import { loadKeys } from '../../utils/localStorage'
import ModalContent from '../../components/ModalContent'
import Pop from '../../components/Pop'
import Icon from '../../components/Icon'
import SignInWithAddress from './SignInWithAddress'
import SignIn from './SignIn'
import Create from './Create'
import Import from './Import'
import Hardware from './Hardware'
import Menu from './Menu'
import s from './Auth.module.scss'

export type Item = {
  title: string
  icon: string
  isNotReady?: boolean
  disabled?: boolean
  render: () => ReactNode
}

export const ModalContext = createContext({ close: () => {}, goBack: () => {} })
const Auth = ({ onClose }: { onClose: () => void }) => {
  const menu: { [key: string]: Item } = {
    SIGN_IN_WITH_ADDRESS: {
      title: 'Sign in with address',
      icon: 'account_balance_wallet',
      render: () => <SignInWithAddress />
    },
    SIGN_IN: {
      title: 'Sign in',
      icon: 'lock',
      disabled: !loadKeys().length,
      render: () => <SignIn />
    },
    CREATE: {
      title: 'Sign up',
      icon: 'person_add',
      render: () => <Create />
    },
    IMPORT: {
      title: 'Recover',
      icon: 'settings_backup_restore',
      render: () => <Import />
    },
    LEDGER: {
      title: 'Sign in with Ledger',
      icon: 'usb',
      render: () => <Hardware />
    }
  }

  const list = isElectron
    ? [menu.SIGN_IN, menu.CREATE, menu.IMPORT]
    : [menu.LEDGER]

  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const modalActions = { close: onClose, goBack: () => setCurrentIndex(-1) }
  const currentMenu = list[currentIndex] || {}

  /* Terra Station */
  const TerraStation = (
    <a href="https://terra.money" target="_blank" rel="noopener noreferrer">
      Terra Station for Windows/MacOS
    </a>
  )

  return currentMenu.render ? (
    <ModalContext.Provider value={modalActions}>
      {currentMenu.render()}
    </ModalContext.Provider>
  ) : (
    <ModalContent close={onClose}>
      <Menu list={list} onSelect={setCurrentIndex} />

      {!isElectron && (
        <Pop
          type="pop"
          placement="top"
          width={380}
          content={
            <p className={s.tooltip}>
              If you want to create an account, please download {TerraStation}.
              We don't support creating an account for Terra Station web due to
              the security reasons.
            </p>
          }
        >
          {({ ref, iconRef, getAttrs }) => (
            <span {...getAttrs({ className: s.footer })} ref={ref}>
              <Icon name="info" forwardRef={iconRef} />
              How can I create an account?
            </span>
          )}
        </Pop>
      )}
    </ModalContent>
  )
}

export default Auth
