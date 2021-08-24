import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PostPage, Coin, User, Field, BankData } from '../types'
import { ConfirmProps } from '../types'
import useBank from '../api/useBank'
import { getFeeDenomList, isFeeAvailable } from './validateConfirm'
import { optionColors } from '../pages/governance/helpers'

export default (
  user: User,
  { id, title }: { id: string; title: string }
): PostPage => {
  const { t } = useTranslation()
  const { data: bank, loading, error } = useBank(user)

  type OptionItem = { key: string; label: string; color: string }
  const OptionsList: OptionItem[] = [
    {
      key: 'yes',
      label: t('Page:Governance:Yes'),
      color: optionColors['Yes'],
    },
    {
      key: 'no',
      label: t('Page:Governance:No'),
      color: optionColors['No'],
    },
    {
      key: 'no_with_veto',
      label: t('Page:Governance:No\nWithVeto'),
      color: optionColors['NoWithVeto'],
    },
    {
      key: 'abstain',
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
        id: key,
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
    url: `/gov/proposals/${id}/votes`,
    payload: { voter: user.address, option: key },
    contents: [{ name: t('Page:Governance:Answer'), text: label }],
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: Coin) => isFeeAvailable(fee, bank.balance),
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
