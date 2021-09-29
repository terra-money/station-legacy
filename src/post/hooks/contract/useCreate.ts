import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Coin, Coins, MsgInstantiateContract } from '@terra-money/terra.js'
import { BankData, CoinFields } from '../../../types'
import { PostPage, CoinItem, Field } from '../../../types'
import { ConfirmProps } from '../../../types'
import { is } from '../../../utils'
import { parseJSON } from '../../../utils/format'
import { useAddress } from '../../../data/auth'
import useBank from '../../../api/useBank'
import useForm from '../../../hooks/useForm'
import { getFeeDenomList, isFeeAvailable } from '../validateConfirm'
import { useCoinsFields } from '../txHooks'
import { stringify } from '../txHelpers'

interface Values {
  code: string
  json: string
  name: string
  desc: string
}

export default (denoms: string[]): PostPage<CoinFields> => {
  const { t } = useTranslation()
  const { data: bank, loading, error } = useBank()
  const address = useAddress()

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

  const getConfirm = (bank: BankData): ConfirmProps => {
    const code_id = Number(code)
    const init_msg = parseJSON(json)
    const init_coins = new Coins(
      coinsFields.coins.map(({ amount, denom }) => new Coin(denom, amount))
    )

    return {
      msgs: [
        new MsgInstantiateContract(
          address,
          address,
          code_id,
          init_msg,
          init_coins
        ),
      ],
      memo: stringify({ name, description }),
      contents: [],
      feeDenom: { list: getFeeDenomList(bank.balance) },
      validate: (fee: CoinItem) => isFeeAvailable(fee, bank.balance),
      submitLabels: [
        t('Post:Contracts:Create'),
        t('Post:Contracts:Creating...'),
      ],
      message: t('Post:Contracts:Created contract'),
      cancel: () => setSubmitted(false),
    }
  }

  return {
    error,
    loading,
    submitted,
    form: formUI,
    confirm: bank && getConfirm(bank),
    ui: coinsFields,
  }
}
