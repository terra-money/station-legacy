import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MsgVote } from '@terra-money/terra.js'
import { PostPage, CoinItem, Field, BankData } from '../../../types'
import { ConfirmProps } from '../../../types'
import { useAddress } from '../../../data/auth'
import useBank from '../../../api/useBank'
import { getFeeDenomList, isFeeAvailable } from '../validateConfirm'
import { optionColors } from '../../../pages/hooks/governance/helpers'

export default ({ id, title }: { id: number; title: string }): PostPage => {
  const { t } = useTranslation()
  const address = useAddress()
  const { data: bank, loading, error } = useBank()

  type OptionItem = { key: MsgVote.Option; label: string; color: string }
  const OptionsList: OptionItem[] = [
    {
      key: MsgVote.Option.VOTE_OPTION_YES,
      label: t('Page:Governance:Yes'),
      color: optionColors['Yes'],
    },
    {
      key: MsgVote.Option.VOTE_OPTION_NO,
      label: t('Page:Governance:No'),
      color: optionColors['No'],
    },
    {
      key: MsgVote.Option.VOTE_OPTION_NO_WITH_VETO,
      label: t('Page:Governance:No\nWithVeto'),
      color: optionColors['NoWithVeto'],
    },
    {
      key: MsgVote.Option.VOTE_OPTION_ABSTAIN,
      label: t('Page:Governance:Abstain'),
      color: optionColors['Abstain'],
    },
  ]

  const [submitted, setSubmitted] = useState(false)

  /* form */
  const [optionIndex, setOptionIndex] = useState<number>()
  const invalid = typeof optionIndex !== 'number'

  /* render */
  const fields: Field<{ color: string }>[] = OptionsList.map(
    ({ key, label, color }, index) => ({
      label,
      element: 'input',
      attrs: {
        type: 'radio',
        name: 'option',
        id: String(key),
        checked: optionIndex === index,
      },
      setValue: () => setOptionIndex(index),
      ui: { color },
    })
  )

  const disabled = invalid

  const formUI = {
    fields,
    disabled,
    title: t('Post:Governance:Vote'),
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => setSubmitted(true),
  }

  const getConfirm = (
    bank: BankData,
    { key, label }: OptionItem
  ): ConfirmProps => ({
    msgs: [new MsgVote(Number(id), address, key)],
    contents: [{ name: t('Page:Governance:Answer'), text: label }],
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: CoinItem) => isFeeAvailable(fee, bank.balance),
    submitLabels: [t('Post:Governance:Vote'), t('Post:Governance:Voting...')],
    message: t('Post:Governance:Voted {{answer}} for {{title}}', {
      answer: label,
      title,
    }),
    cancel: () => setSubmitted(false),
  })

  return {
    error,
    loading,
    submitted,
    form: formUI,
    confirm:
      bank && typeof optionIndex === 'number'
        ? getConfirm(bank, OptionsList[optionIndex])
        : undefined,
  }
}
