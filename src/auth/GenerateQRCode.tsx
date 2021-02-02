import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Component from 'qrcode.react'
import { FormUI, useAuth, useForm } from '../use-station/src'
import validateForm from '../use-station/src/post/validateForm'
import { getStoredWallet } from '../utils/localStorage'
import { encrypt } from '../utils/terra-keystore'
import Form from '../components/Form'
import styles from './GenerateQRCode.module.scss'

interface Values {
  password: string
}

const GenerateQRCode = () => {
  const { user } = useAuth()
  const [key, setKey] = useState('')

  const { t } = useTranslation()
  const v = validateForm(t)

  const initial = { password: '' }
  const validate = ({ password }: Values) => ({
    password: v.password(password),
  })

  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid, getDefaultProps, getDefaultAttrs } = form
  const { password } = values

  const [incorrect, setIncorrect] = useState(false)

  const formProps: FormUI = {
    title: 'Export with QR code',
    fields: [
      {
        ...getDefaultProps('password'),
        label: t('Auth:Form:Password'),
        attrs: {
          ...getDefaultAttrs('password'),
          type: 'password',
          placeholder: t('Auth:Form:Must be at least 10 characters'),
          autoFocus: true,
        },
        setValue: (value) => {
          setIncorrect(false)
          setValue('password', value)
        },
        error: incorrect ? t('Auth:Form:Incorrect password') : undefined,
      },
    ],
    disabled: invalid,
    submitLabel: 'Generate QR code',
    onSubmit: () => {
      const decrypted = getStoredWallet(user?.name!, password)
      setKey(encrypt(decrypted.privateKey, password))
    },
  }

  return !key ? (
    <Form form={formProps} />
  ) : (
    <div className={styles.component}>
      <h1 className={styles.title}>Export with QR code</h1>

      <Component
        value={key}
        size={320}
        bgColor="#f4f5fb"
        fgColor="#2043b5"
        includeMargin
      />
    </div>
  )
}

export default GenerateQRCode
