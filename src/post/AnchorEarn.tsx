import { Coin } from '@terra-money/terra.js'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BankData, CoinItem } from '../types'
import { div, format } from '../utils'
import { toAmount, toInput } from '../utils/format'
import useBank from '../api/useBank'
import useForm from '../hooks/useForm'
import validateForm from './hooks/validateForm'
import useCalcTax from './hooks/useCalcTax'
import { getFeeDenomList, isFeeAvailable } from './hooks/validateConfirm'

import useAnchorEarn from '../pages/bank/useAnchorEarn'
import { AnchorEarnInfo, AnchorEarnTxType } from '../pages/bank/useAnchorEarn'
import Post from './Post'
import { ReactComponent as AnchorLogo } from './AnchorLogo.svg'
import styles from './AnchorEarn.module.scss'

interface Values {
  input: string
}

interface Props {
  type: AnchorEarnTxType
  earn: AnchorEarnInfo
}

const denom = 'uusd'

const AnchorEarnComponent = ({ type, earn }: Props) => {
  const { t } = useTranslation()
  const v = validateForm(t)
  const { data: bank, loading, error } = useBank()

  const { uusd, aust, exchangeRate, getMsg } = earn
  const max = { Deposit: uusd, Withdraw: aust }[type]

  const validate = ({ input }: Values) => ({
    input: v.input(input, { max: toInput(max) }),
  })

  const initial = { input: '' }

  const [submitted, setSubmitted] = useState(false)
  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid, getDefaultProps, getDefaultAttrs } = form
  const { input } = values
  const amount = toAmount(input)
  const calcTax = useCalcTax(denom, t)

  const fields = [
    {
      ...getDefaultProps('input'),
      label: t('Common:Tx:Amount'),
      button: {
        label: t('Common:Account:Available'),
        display: format.display({ amount: max, denom }),
        attrs: {
          onClick: () => setValue('input', toInput(max)),
        },
      },
      attrs: {
        ...getDefaultAttrs('input'),
        type: 'number' as const,
        placeholder: '0',
        autoFocus: true,
      },
      unit: 'UST',
    },
  ]

  const getConfirm = (bank: BankData) => {
    const coin = format.coin({ amount, denom })
    const display = format.display({ amount, denom })
    const tax = calcTax.getTax(amount)

    return {
      contents: [{ name: t('Common:Tx:Amount'), displays: [display] }],
      feeDenom: { list: getFeeDenomList(bank.balance) },
      cancel: () => setSubmitted(false),
      msgs: getMsg(
        { Deposit: input, Withdraw: div(input, exchangeRate) }[type],
        type
      ),
      tax: type === 'Deposit' ? new Coin(denom, tax) : undefined,
      validate: (fee: CoinItem) => isFeeAvailable(fee, bank.balance),
      submitLabels: {
        Deposit: ['Deposit', 'Depositing...'],
        Withdraw: ['Withdraw', 'Withdrawing...'],
      }[type],
      message: `${
        { Deposit: 'Deposited', Withdraw: 'Withdrawn' }[type]
      } ${coin}`,
    }
  }

  const disabled = invalid

  const formUI = {
    fields,
    disabled,
    title: `${type} UST`,
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => setSubmitted(true),
  }

  const confirm = bank && getConfirm(bank)

  const h2 = (
    <div className={styles.powered}>
      Powered by <AnchorLogo />
    </div>
  )

  const renderAfterFields = () => (
    <div className={styles.desc}>
      <p>
        Anchor is a savings protocol offering low-volatile yields on Terra
        stablecoin deposits.
      </p>
    </div>
  )

  return (
    <Post
      post={{ error, loading, submitted, form: formUI, confirm }}
      formProps={{ h2, renderAfterFields }}
    />
  )
}

const AnchorEarn = ({ type }: { type: AnchorEarnTxType }) => {
  const earn = useAnchorEarn()
  return earn ? <AnchorEarnComponent type={type} earn={earn} /> : null
}

export default AnchorEarn
