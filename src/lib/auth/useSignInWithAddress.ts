import { useTranslation } from 'react-i18next'
import { SignInWithAddress } from '../types'
import { useAuth } from '../contexts/AuthContext'
import useForm from '../hooks/useForm'
import validateForm from '../post/validateForm'

interface Values {
  address: string
}

export default (): SignInWithAddress => {
  const { t } = useTranslation()
  const { signIn } = useAuth()

  const v = validateForm(t)

  /* form */
  const validate = ({ address }: Values) => ({ address: v.address(address) })
  const form = useForm<Values>({ address: '' }, validate)
  const { values, invalid: disabled, getDefaultProps, getDefaultAttrs } = form
  const { address } = values

  const fields = [
    {
      ...getDefaultProps('address'),
      label: t('Auth:SignIn:Wallet address'),
      attrs: {
        ...getDefaultAttrs('address'),
        placeholder: t('Auth:SignIn:Input your wallet address'),
        autoFocus: true,
      },
    },
  ]

  const onSubmit = () => signIn({ address })

  return {
    form: {
      title: t('Auth:Menu:Browse with address'),
      fields,
      disabled,
      submitLabel: t('Auth:SignIn:Browse'),
      onSubmit: disabled ? undefined : onSubmit,
    },
  }
}
