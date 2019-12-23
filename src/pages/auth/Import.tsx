import React from 'react'
import { useTranslation } from 'react-i18next'
import AccountForm from './AccountForm'

const Import = () => {
  const { t } = useTranslation()
  return (
    <AccountForm
      title={t('Import with seed')}
      initial={() => ({
        name: '',
        password: '',
        confirm: '',
        phrases: Array.from({ length: 24 }, () => ''),
        written: true
      })}
    />
  )
}

export default Import
