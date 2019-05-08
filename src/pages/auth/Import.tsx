import React from 'react'
import AccountForm from './AccountForm'

const Import = () => (
  <AccountForm
    title="Import with seed"
    initial={() => ({
      name: '',
      password: '',
      confirm: '',
      phrases: Array.from({ length: 24 }, () => ''),
      written: true
    })}
  />
)

export default Import
