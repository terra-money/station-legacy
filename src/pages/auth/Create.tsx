import React from 'react'
import electron from '../../helpers/electron'
import AccountForm from './AccountForm'

const Create = () => (
  <AccountForm
    title="Create an account"
    initial={() => ({
      name: '',
      password: '',
      confirm: '',
      phrases: electron<string>('generateSeed').split(' '),
      written: false
    })}
    generated
  />
)

export default Create
