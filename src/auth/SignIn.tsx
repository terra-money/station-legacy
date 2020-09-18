import React from 'react'
import { useSignIn } from '@terra-money/use-station'
import { loadKeys, testPassword } from '../utils/localStorage'
import { useAuthModal } from './useAuthModal'
import ModalContent from '../components/ModalContent'
import Form from '../components/Form'

const SignIn = () => {
  const accounts = loadKeys()
  const { form } = useSignIn({
    list: accounts,
    test: ({ name, password }) => testPassword(name, password),
  })

  /* modal */
  const modal = useAuthModal()

  return (
    <ModalContent {...modal}>
      <Form form={form} />
    </ModalContent>
  )
}

export default SignIn
