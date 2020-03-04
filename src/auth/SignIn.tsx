import React, { useState } from 'react'
import { useSignIn } from '@terra-money/use-station'
import { loadKeys, testPassword } from '../utils/localStorage'
import { useAuthModal } from './useAuthModal'
import ModalContent from '../components/ModalContent'
import Form from '../components/Form'
import ManageAccounts from './ManageAccounts'

const SignIn = () => {
  const accounts = loadKeys()
  const { form } = useSignIn({
    list: accounts,
    test: ({ name, password }) => testPassword(name, password)
  })

  /* modal */
  const modal = useAuthModal()

  /* settings */
  const [settings, setSettings] = useState(false)
  const actions = [{ icon: 'settings', onClick: () => setSettings(true) }]

  return settings ? (
    <ManageAccounts
      modalActions={{ ...modal, goBack: () => setSettings(false) }}
      onDeleteAll={modal.goBack}
    />
  ) : (
    <ModalContent {...modal} actions={!!accounts.length ? actions : undefined}>
      <Form form={form} />
    </ModalContent>
  )
}

export default SignIn
