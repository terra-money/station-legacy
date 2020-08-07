import React, { useState } from 'react'
import { useSignIn } from '@terra-money/use-station'
import { loadKeys, testPassword } from '../utils/localStorage'
import { useAuthModal } from './useAuthModal'
import ModalContent from '../components/ModalContent'
import Form from '../components/Form'
import Icon from '../components/Icon'
import ManageAccounts from './ManageAccounts'
import s from './SignIn.module.scss'

const SignIn = () => {
  const accounts = loadKeys()
  const { form, manage } = useSignIn({
    list: accounts,
    test: ({ name, password }) => testPassword(name, password),
  })

  /* modal */
  const modal = useAuthModal()

  /* settings */
  const [settings, setSettings] = useState(false)
  const h2 = !!accounts.length ? (
    <button className={s.manage} onClick={() => setSettings(true)}>
      <Icon name="settings" />
      <strong>{manage[0]}</strong>({manage[1]})
    </button>
  ) : undefined

  return settings ? (
    <ManageAccounts
      modalActions={{ ...modal, goBack: () => setSettings(false) }}
      onFinish={modal.goBack}
    />
  ) : (
    <ModalContent {...modal}>
      <Form form={form} h2={h2} />
    </ModalContent>
  )
}

export default SignIn
