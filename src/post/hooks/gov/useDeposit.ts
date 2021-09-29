import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Coins, MsgDeposit } from '@terra-money/terra.js'
import { PostPage, CoinItem, Field, BankData } from '../../../types'
import { ConfirmProps } from '../../../types'
import { format, find } from '../../../utils'
import { toAmount, toInput } from '../../../utils/format'
import { useAddress } from '../../../data/auth'
import useBank from '../../../api/useBank'
import useForm from '../../../hooks/useForm'
import validateForm from '../validateForm'
import { isAvailable, getFeeDenomList } from '../validateConfirm'

interface Values {
  input: string
}

const denom = 'uluna'
export default ({ id, title }: { id: number; title: string }): PostPage => {
  const { t } = useTranslation()
  const address = useAddress()
  const { data: bank, loading, error } = useBank()
  const [submitted, setSubmitted] = useState(false)
  const v = validateForm(t)

  /* max */
  const available = find(`${denom}:available`, bank?.balance) ?? '0'
  const max = { amount: available, denom }

  /* form */
  const validate = ({ input }: Values) => ({
    input: v.input(input, { max: toInput(max.amount) }),
  })

  const initial = { input: '' }
  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid, getDefaultProps, getDefaultAttrs } = form
  const { input } = values
  const amount = toAmount(input)

  /* render */
  const unit = format.denom(denom)
  const fields: Field[] = [
    {
      ...getDefaultProps('input'),
      label: t('Common:Tx:Amount'),
      button: {
        label: t('Common:Account:Available'),
        display: format.display(max),
        attrs: { onClick: () => setValue('input', toInput(max.amount)) },
      },
      attrs: {
        ...getDefaultAttrs('input'),
        type: 'number',
        placeholder: '0',
      },
      unit,
    },
  ]

  const disabled = invalid

  const formUI = {
    title: t('Post:Governance:Deposit'),
    fields,
    disabled,
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => setSubmitted(true),
  }

  const getConfirm = (bank: BankData): ConfirmProps => ({
    msgs: [new MsgDeposit(Number(id), address, new Coins({ uluna: amount }))],
    contents: [
      {
        name: t('Page:Governance:Deposit'),
        displays: [format.display({ amount, denom })],
      },
    ],
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: CoinItem) =>
      isAvailable({ amount, denom, fee }, bank.balance),
    submitLabels: [
      t('Post:Governance:Deposit'),
      t('Post:Governance:Depositing...'),
    ],
    message: t('Post:Governance:Deposited {{coin}} to {{title}}', {
      coin: format.coin({ amount, denom }),
      title,
    }),
    cancel: () => setSubmitted(false),
  })

  return {
    error,
    loading,
    submitted,
    form: formUI,
    confirm: bank && getConfirm(bank),
  }
}
