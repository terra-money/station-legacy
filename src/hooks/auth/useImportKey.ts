import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { decode } from 'js-base64'
import { RawKey } from '@terra-money/terra.js'
import { useAuth } from '../../data/auth'
import { Field, ImportKey } from '../../types'
import { decrypt } from '../../utils'
import useForm from '../../hooks/useForm'

interface Values {
  key: string
  password: string
}

interface Props {
  onSuccess: (params: WalletParams) => Promise<void>
}

export default ({ onSuccess }: Props): ImportKey => {
  const { t } = useTranslation()
  const { signIn } = useAuth()

  const PW = t('Auth:Form:Password')

  /* form */
  const initial = { key: '', password: '' }
  const validate = () => ({ key: '', password: '' })
  const form = useForm<Values>(initial, validate)
  const { values, invalid, getDefaultProps, getDefaultAttrs } = form

  const fields: Field[] = [
    {
      ...getDefaultProps('key'),
      element: 'textarea',
      label: 'Key',
      attrs: getDefaultAttrs('key'),
    },
    {
      ...getDefaultProps('password'),
      label: PW,
      attrs: {
        ...getDefaultAttrs('password'),
        type: 'password',
        placeholder: t('Auth:Form:Must be at least 10 characters'),
      },
    },
  ]

  const [error, setError] = useState<Error>()

  type Decoded = { name: string; address: string; encrypted_key: string }

  const importKey = async () => {
    try {
      const { key, password } = values
      const { name, address, encrypted_key }: Decoded = JSON.parse(decode(key))
      const privateKey = decrypt(encrypted_key, password)

      if (!privateKey) throw new Error(t('Auth:Form:Incorrect password'))

      const rawKey = new RawKey(Buffer.from(privateKey, 'hex'))
      const publicKey = Buffer.from(
        rawKey.publicKey!.encodeAminoPubkey()
      ).toString('hex')

      const wallet = { privateKey, publicKey, terraAddress: address }
      await onSuccess({ name, password, wallet })
      signIn({ name, address })
    } catch (error) {
      setError(error)
    }
  }

  const disabled = invalid

  return {
    form: {
      title: 'Import private key',
      fields,
      disabled,
      submitLabel: 'Submit',
      onSubmit: disabled ? undefined : importKey,
    },
    error,
  }
}
