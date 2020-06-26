import React, { useState } from 'react'
import { useSignInWithAddress } from '@terra-money/use-station'
import ModalContent from '../components/ModalContent'
import Form from '../components/Form'
import { useAuthModal } from './useAuthModal'
import RecentAddresses from './RecentAddresses'

const SignInWithAddress = () => {
  const { form } = useSignInWithAddress()
  const modal = useAuthModal()

  /* refresh */
  const [key, setKey] = useState(0)
  const refresh = () => setKey((k) => k + 1)

  return (
    <ModalContent {...modal}>
      <Form form={form}>
        <RecentAddresses onDeleteAll={refresh} key={key} />
      </Form>
    </ModalContent>
  )
}

export default SignInWithAddress
