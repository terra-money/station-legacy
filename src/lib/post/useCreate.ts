import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BankData, CoinFields } from '../types'
import { PostPage, Coin, User, Field } from '../types'
import { ConfirmProps } from '../types'
import { is, format } from '../utils'
import useBank from '../api/useBank'
import useForm from '../hooks/useForm'
import { getFeeDenomList, isFeeAvailable } from './validateConfirm'
import { useCoinsFields } from './txHooks'
import { stringify } from './txHelpers'

interface Values {
  code: string
  json: string
  name: string
  desc: string
}

export default (user: User, denoms: string[]): PostPage<CoinFields> => {
  const { t } = useTranslation()
  const { data: bank, loading, error } = useBank(user)

  const [submitted, setSubmitted] = useState(false)

  /* form */
  const validate = ({ code, json }: Values) => ({
    code: !code.length
      ? t('Common:Validate:{{label}} is required', {
          label: t('Post:Contracts:Code'),
        })
      : '',
    json: !is.json(json)
      ? t('Common:Validate:{{label}} is invalid', { label: 'JSON' })
      : '',
    name: '',
    desc: '',
  })
  const initial = { code: '', json: '', name: '', desc: '' }
  const form = useForm<Values>(initial, validate)
  const { values, invalid, getDefaultProps, getDefaultAttrs } = form
  const { code, json, name, desc: description } = values

  /* render */
  const coinsFields = useCoinsFields(denoms)

  const fields: Field[] = [
    {
      ...getDefaultProps('code'),
      label: t('Post:Contracts:Code'),
      attrs: getDefaultAttrs('code'),
    },
    {
      ...getDefaultProps('json'),
      element: 'textarea',
      label: t('Post:Contracts:InitMsg JSON'),
      attrs: getDefaultAttrs('json'),
    },
    {
      ...getDefaultProps('name'),
      label: t('Post:Contracts:Name'),
      attrs: getDefaultAttrs('name'),
    },
    {
      ...getDefaultProps('desc'),
      label: t('Post:Contracts:Description'),
      attrs: getDefaultAttrs('desc'),
    },
  ]

  const disabled = invalid || coinsFields.invalid

  const formUI = {
    title: t('Post:Contracts:Create contract'),
    fields,
    disabled,
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => setSubmitted(true),
  }

  const getConfirm = (bank: BankData): ConfirmProps => ({
    url: `/wasm/codes/${code}`,
    payload: {
      init_coins: coinsFields.coins,
      init_msg: format.sanitizeJSON(json),
    },
    memo: stringify({ name, description }),
    contents: [],
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: Coin) => isFeeAvailable(fee, bank.balance),
    submitLabels: [t('Post:Contracts:Create'), t('Post:Contracts:Creating...')],
    message: t('Post:Contracts:Created contract'),
    cancel: () => setSubmitted(false),
  })

  return {
    error,
    loading,
    submitted,
    form: formUI,
    confirm: bank && getConfirm(bank),
    ui: coinsFields,
  }
}
