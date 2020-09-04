import React, { useState } from 'react'
import { AuthMenuKey, useAuthMenu } from '@terra-money/use-station'
import { isElectron } from '../utils/env'
import { loadKeys } from '../utils/localStorage'
import { useApp } from '../hooks'
import ModalContent from '../components/ModalContent'
import { menu } from './getAuthMenu'
import getAuthMenuKeys from './getAuthMenuKeys'
import { AuthModalProvider } from './useAuthModal'
import AuthMenu from './AuthMenu'
import AuthFooter from './AuthFooter'

const AuthModal = () => {
  const { authModal } = useApp()
  const [currentKey, setCurrentKey] = useState<AuthMenuKey>()

  const keys: AuthMenuKey[] = getAuthMenuKeys()
  const { ui, list } = useAuthMenu(keys)

  const actions = {
    glance: () => setCurrentKey('signInWithAddress'),
    download: () => setCurrentKey('download'),
  }

  /* Modal */
  const modalActions = {
    close: authModal.close,
    goBack: currentKey && (() => setCurrentKey(undefined)),
  }

  const footer = !isElectron && <AuthFooter {...ui.web} />

  return (
    <AuthModalProvider value={{ modalActions, actions }}>
      <ModalContent {...modalActions}>
        {!currentKey ? (
          <AuthMenu
            list={list.map(({ label, key }) => {
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
            })}
            footer={footer}
          />
        ) : (
          menu[currentKey].render()
        )}
      </ModalContent>
    </AuthModalProvider>
  )
}

export default AuthModal
