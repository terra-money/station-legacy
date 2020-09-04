import React, { useState } from 'react'
import { useSignInWithAddress } from '@terra-money/use-station'
import Form from '../components/Form'
import RecentAddresses from './RecentAddresses'

const SignInWithAddress = () => {
  const { form } = useSignInWithAddress()

  /* refresh */
  const [key, setKey] = useState(0)
  const refresh = () => setKey((k) => k + 1)

  return (
    <Form form={form}>
      <RecentAddresses onDeleteAll={refresh} key={key} />
    </Form>
  )
}

export default SignInWithAddress
