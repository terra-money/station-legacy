import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Coin, Coins, MsgExecuteContract } from '@terra-money/terra.js'
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
import useCalcTaxes from '../useCalcTaxes'

interface Values {
  address: string
  json: string
}

export default (
  contractAddress: string,
  denoms: string[]
): PostPage<CoinFields> => {
  const { t } = useTranslation()
  const { data: bank, loading, error } = useBank()
  const address = useAddress()

  const [submitted, setSubmitted] = useState(false)

  /* form */
  const validate = ({ json }: Values) => ({
    address: '',
    json: !is.json(json)
      ? t('Common:Validate:{{label}} is invalid', { label: 'JSON' })
      : '',
  })
  const initial = { address: contractAddress, json: '' }
  const form = useForm<Values>(initial, validate)
  const { values, invalid, getDefaultProps, getDefaultAttrs } = form

  /* render */
  const coinsFields = useCoinsFields(denoms)
  const coinsDenoms = coinsFields.coins
    .map(({ denom }) => denom)
    .filter((denom) => denom !== 'uluna')
  const { getTax } = useCalcTaxes(coinsDenoms, t)

  const fields: Field[] = [
    {
      ...getDefaultProps('address'),
      label: t('Post:Contracts:Contract address'),
      attrs: { ...getDefaultAttrs('address'), readOnly: true },
    },
    {
      ...getDefaultProps('json'),
      element: 'textarea',
      label: t('Post:Contracts:HandleMsg JSON'),
      attrs: getDefaultAttrs('json'),
    },
  ]

  const disabled = invalid || coinsFields.invalid

  const formUI = {
    title: t('Post:Contracts:Interact with'),
    fields,
    disabled,
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => setSubmitted(true),
  }

  const getConfirm = (bank: BankData): ConfirmProps => ({
    msgs: [
      new MsgExecuteContract(
        address,
        contractAddress,
        parseJSON(values.json),
        Coins.fromData(coinsFields.coins)
      ),
    ],
    tax: new Coins(
      coinsFields.coins.map(
        ({ amount, denom }) => new Coin(denom, getTax(amount, denom))
      )
    ),
    contents: [],
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: CoinItem) => isFeeAvailable(fee, bank.balance),
    submitLabels: [
      t('Post:Contracts:Interact'),
      t('Post:Contracts:Interacting...'),
    ],
    message: t(`Post:Contracts:Interacted with {{address}}`, {
      address: contractAddress,
    }),
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
