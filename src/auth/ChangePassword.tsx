import React from 'react'
import { useChangePassword } from '@terra-money/use-station'
import { testPassword } from '../utils/localStorage'
import Form from '../components/Form'

interface Props {
  name: string
  onChange: (params: { current: string; password: string }) => Promise<void>
}

const ChangePassword = ({ name, onChange }: Props) => {
  const form = useChangePassword({
    name,
    test: ({ name, password }) => testPassword(name, password),
    changePassword: onChange,
  })

  return <Form form={form} />
}

export default ChangePassword
