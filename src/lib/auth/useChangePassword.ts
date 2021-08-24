import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChangePassword, TestPassword } from '../types'
import useForm from '../hooks/useForm'
import validateForm, { validateConfirm } from '../post/validateForm'

interface Values {
  current: string
  password: string
  confirm: string
}

interface Props {
  name: string
  test: TestPassword
  changePassword: (params: {
    current: string
    password: string
  }) => Promise<void>
}

export default ({ name, test, changePassword }: Props): ChangePassword => {
  const { t } = useTranslation()
  const v = validateForm(t)

  /* form */
  const initial = { name, current: '', password: '', confirm: '' }
  const [incorrect, setIncorrect] = useState(false)

  const validate = ({ current, password, confirm }: Values) => ({
    current: v.password(current),
    ...validateConfirm({ password, confirm }, t),
  })

  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid, getDefaultProps, getDefaultAttrs } = form
  const { current, password } = values

  return {
    title: t('Auth:Manage:Change password'),
    fields: [
      {
        element: 'input',
        label: t('Auth:SignUp:Wallet name'),
        attrs: { id: 'name', value: name, readOnly: true },
      },
      {
        ...getDefaultProps('current'),
        label: t('Auth:Manage:Current password'),
        attrs: {
          ...getDefaultAttrs('current'),
          type: 'password',
          placeholder: t('Auth:Form:Must be at least 10 characters'),
          autoFocus: true,
        },
        setValue: (value) => {
          setIncorrect(false)
          setValue('current', value)
        },
        error: incorrect ? t('Auth:Form:Incorrect password') : undefined,
      },
      {
        ...getDefaultProps('password'),
        label: t('Auth:Manage:New password'),
        attrs: {
          ...getDefaultAttrs('password'),
          type: 'password',
          placeholder: t('Auth:Form:Must be at least 10 characters'),
        },
      },
      {
        ...getDefaultProps('confirm'),
        label: t('Auth:Manage:Confirm new password'),
        attrs: {
          ...getDefaultAttrs('confirm'),
          type: 'password',
          placeholder: t('Auth:SignUp:Confirm your password'),
        },
      },
    ],
    disabled: invalid,
    submitLabel: t('Auth:Manage:Change password'),
    onSubmit: () => {
      test({ name, password: current })
        ? changePassword({ current, password })
        : setIncorrect(true)
    },
  }
}
