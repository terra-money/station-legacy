import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../data/auth'
import useForm from '../../hooks/useForm'
import validateForm from '../../post/hooks/validateForm'
import { SignInWithAddress } from '../../types'
import { useTns } from '../useTns'

interface Values {
  address: string
}

export default (): SignInWithAddress => {
  const { t } = useTranslation()
  const { signIn } = useAuth()

  const {
    address: resolvedAddress,
    error: tnsError,
    resolve: resolveTns,
  } = useTns()

  const v = validateForm(t)

  /* form */
  const validate = ({ address }: Values) => {
    const recipient = resolvedAddress || address

    return {
      address: tnsError || v.address(recipient),
    }
  }

  const form = useForm<Values>({ address: '' }, validate)
  const { values, invalid: disabled, getDefaultProps, getDefaultAttrs } = form
  const { address } = values

  useEffect(() => {
    resolveTns(address)
  }, [address, resolveTns])

  const fields = [
    {
      ...getDefaultProps('address'),
      label: t('Auth:SignIn:Wallet address'),
      helper: resolvedAddress,
      attrs: {
        ...getDefaultAttrs('address'),
        placeholder: t('Auth:SignIn:Input your wallet address'),
        autoFocus: true,
      },
    },
  ]

  const submit = () => signIn({ address: resolvedAddress || address })

  return {
    form: {
      title: t('Auth:Menu:Browse with address'),
      fields,
      disabled,
      submitLabel: t('Auth:SignIn:Browse'),
      onSubmit: disabled ? undefined : submit,
    },
  }
}
