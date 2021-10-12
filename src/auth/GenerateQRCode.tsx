import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { encode } from 'js-base64'
import { FormUI, useForm } from '../lib'
import validateForm from '../post/hooks/validateForm'
import { getStoredWallet } from '../utils/localStorage'
import { encrypt } from '../utils/terra-keystore'
import { useUser } from '../data/auth'
import Form from '../components/Form'
import InvalidFeedback from '../components/InvalidFeedback'
import QRCode from './QRCode'

interface Values {
  password: string
}

const GenerateQRCode = ({ exportKey }: { exportKey?: boolean }) => {
  const user = useUser()
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
    title: exportKey ? 'Export private key' : 'Export with QR code',
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
    submitLabel: exportKey ? 'Generate key' : 'Generate QR code',
    onSubmit: () => {
      try {
        const decrypted = getStoredWallet(user?.name!, password)
        setKey(encrypt(decrypted.privateKey, password))
      } catch (error) {
        setIncorrect(true)
      }
    },
  }

  const encoded = encode(
    JSON.stringify({
      name: user!.name,
      address: user!.address,
      encrypted_key: key,
    })
  )

  const data = `terrastation://wallet_recover/?payload=${encoded}`

  return !key ? (
    <Form form={formProps} />
  ) : (
    <QRCode
      title={exportKey ? 'Export private key' : 'Export with QR code'}
      data={exportKey ? encoded : data}
      warn={
        exportKey ? (
          <>
            <InvalidFeedback>Keep this encrypted key private</InvalidFeedback>
            <InvalidFeedback>
              Both the private key and password are required to recover a wallet
            </InvalidFeedback>
          </>
        ) : (
          <InvalidFeedback>
            {t('Auth:Manage:Keep this QR code private')}
          </InvalidFeedback>
        )
      }
      exportKey={exportKey}
    />
  )
}

export default GenerateQRCode
