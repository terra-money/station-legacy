import React from 'react'
import { useTranslation } from 'react-i18next'
import electron from '../../helpers/electron'
import AccountForm from './AccountForm'

const Create = () => {
  const { t } = useTranslation()

  return (
    <AccountForm
      title={t('Create an account')}
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
}

export default Create
