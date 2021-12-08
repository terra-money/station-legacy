import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AccAddress, MsgExecuteContract } from '@terra-money/terra.js'
import { BankData } from '../../../types'
import { PostPage, CoinItem, Field } from '../../../types'
import { ConfirmContent, ConfirmProps } from '../../../types'
import { useAddress } from '../../../auth/auth'
import useBank from '../../../api/useBank'
import useForm from '../../../hooks/useForm'
import validateForm from '../validateForm'
import { isFeeAvailable } from '../validateConfirm'
import { getFeeDenomList } from '../validateConfirm'

interface Values {
  to: string
  input: string
  memo: string
}

export default (nftContract: string, token_id: string): PostPage => {
  const { t } = useTranslation()
  const address = useAddress()
  const { data: bank, loading: bankLoading, error } = useBank()
  const loading = bankLoading
  const v = validateForm(t)

  /* form */
  const validate = ({ input, to, memo }: Values) => ({
    to: v.address(to),
    input: v.input(input),
    memo:
      v.length(memo, { max: 256, label: t('Common:Tx:Memo') }) ||
      v.includes(memo, '<') ||
      v.includes(memo, '>'),
  })

  const initial = { to: '', input: '', memo: '' }
  const form = useForm<Values>(initial, validate)
  const { values } = form
  const { getDefaultProps, getDefaultAttrs } = form
  const { to, memo } = values

  /* tax */
  const [submitted, setSubmitted] = useState(false)

  /* render */
  const defaultFields: Field[] = [
    {
      ...getDefaultProps('to'),
      label: t('Post:Send:Send to'),
      attrs: {
        ...getDefaultAttrs('to'),
        placeholder: `Terra address`,
        autoFocus: true,
      },
    },
    {
      ...getDefaultProps('memo'),
      label: `${t('Common:Tx:Memo')} (${t('Common:Form:Optional')})`,
      attrs: {
        ...getDefaultAttrs('memo'),
        placeholder: t('Post:Send:Input memo'),
      },
    },
  ]

  const disabled = !AccAddress.validate(to)

  const formUI = {
    title: t('Post:Send:Send'),
    fields: defaultFields,
    disabled,
    submitLabel: t('Common:Form:Next'),
    onSubmit: () => setSubmitted(true),
  }

  const contents: ConfirmContent[] = ([] as ConfirmContent[])
    .concat([
      {
        name: t('Post:Send:Send to'),
        text: to,
      },
    ])
    .concat(memo ? { name: t('Common:Tx:Memo'), text: memo } : [])

  const getConfirm = (bank: BankData): ConfirmProps => ({
    msgs: [
      new MsgExecuteContract(address, nftContract, {
        transfer_nft: { recipient: to, token_id },
      }),
    ],
    memo,
    contents,
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: CoinItem) => isFeeAvailable(fee, bank.balance),
    submitLabels: [t('Post:Send:Send'), t('Post:Send:Sending...')],
    message: t('Post:Send:Sent {{coin}} to {{address}}', {
      coin: token_id,
      address: to,
    }),
    warning: [
      t(
        'Post:Send:Please double check if the above transaction requires a memo'
      ),
    ],
    cancel: () => setSubmitted(false),
  })

  return {
    error,
    loading,
    submitted,
    form: formUI,
    confirm: bank ? getConfirm(bank) : undefined,
  }
}
