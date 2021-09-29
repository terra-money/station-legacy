import { useState } from 'react'
import { useSignInWithAddress } from '../lib'
import Form from '../components/Form'
import RecentAddresses from './RecentAddresses'

const SignInWithAddress = () => {
  const { form } = useSignInWithAddress()

  /* refresh */
  const [key, setKey] = useState(0)
  const refresh = () => setKey((k) => k + 1)

  return (
    <Form
      form={form}
      renderAfterFields={() => (
        <RecentAddresses onDeleteAll={refresh} key={key} />
      )}
    />
  )
}

export default SignInWithAddress
