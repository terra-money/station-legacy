import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dictionary, last } from 'ramda'
import _ from 'lodash'
import { MsgExecuteContract, MsgSend } from '@terra-money/terra.js'
import { Coin } from '@terra-money/terra.js'
import { BankData, TxsData, Tx, Whitelist } from '../types'
import { RecentSentUI, RecentSentItemUI } from '../types'
import { PostPage, Coin as StationCoin, User, Field } from '../types'
import { ConfirmContent, ConfirmProps } from '../types'
import { is, format, find } from '../utils'
import { gt, max, minus } from '../utils/math'
import { toAmount, toInput } from '../utils/format'
import { TokenBalanceQuery } from '../cw20/useTokenBalance'
import useFCD from '../api/useFCD'
import useBank from '../api/useBank'
import useForm from '../hooks/useForm'
import validateForm from './validateForm'
import { isAvailable, getFeeDenomList, isFeeAvailable } from './validateConfirm'
import { useCalcFee } from './txHelpers'
import useCalcTax from './useCalcTax'

interface Values {
  to: string
  input: string
  memo: string
}

export default (
  user: User,
  denom: string,
  tokenBalance: TokenBalanceQuery
): PostPage<RecentSentUI> => {
  const { t } = useTranslation()
  const { data: bank, loading: bankLoading, error } = useBank(user)
  const { list: tokens, loading: tokenLoading, whitelist } = tokenBalance
  const loading = bankLoading || tokenLoading
  const v = validateForm(t)

  /* recent txs */
  const url = '/v1/msgs'
  const params = { account: user.address, action: 'send' }
  const txsResponse = useFCD<TxsData>({ url, params })

  const renderRecentItem = ({
    date,
    values,
  }: RecentSentItem): RecentSentItemUI => {
    const { to, input, memo } = values

    return {
      title: date,
      contents: [
        { title: t('Post:Send:Send to'), content: to },
        { title: t('Common:Tx:Amount'), content: `${input} ${unit}` },
        { title: t('Common:Tx:Memo'), content: memo },
      ].filter(({ content }) => content),
      onClick: () => form.setValues({ ...values, to, memo }),
    }
  }

  const renderRecent = ({ txs }: TxsData): RecentSentUI | undefined => {
    const recent = !gt(txs.length, 0) ? undefined : findRecent(txs, denom)

    return !recent?.length
      ? undefined
      : {
          title: t('Post:Send:Recent transactions', { unit }),
          contents: recent.map(renderRecentItem),
        }
  }

  /* form */
  const getBalance = () =>
    (is.nativeDenom(denom)
      ? find(`${denom}:available`, bank?.balance)
      : tokens?.find(({ token }) => token === denom)?.balance) ?? '0'

  const validate = ({ input, to, memo }: Values) => ({
    to: v.address(to),
    input: v.input(
      input,
      { max: toInput(getBalance(), whitelist?.[denom]?.decimals) },
      whitelist?.[denom]?.decimals
    ),
    memo:
      v.length(memo, { max: 256, label: t('Common:Tx:Memo') }) ||
      v.includes(memo, '<') ||
      v.includes(memo, '>'),
  })

  const initial = { to: '', input: '', memo: '' }
  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid } = form
  const { getDefaultProps, getDefaultAttrs } = form
  const { to, input, memo } = values
  const amount = toAmount(input, whitelist?.[denom]?.decimals)

  /* tax */
  const [submitted, setSubmitted] = useState(false)
  const shouldTax = is.nativeTerra(denom)
  const calcTax = useCalcTax(denom, t)
  const calcFee = useCalcFee()
  const balance = getBalance()

  const calculatedMaxAmount = calcTax.getMax(balance)
  const maxAmount =
    bank?.balance.length === 1 && calcFee
      ? max([
          minus(calculatedMaxAmount, calcFee.feeFromGas('150000', denom)),
          0,
        ])
      : calculatedMaxAmount
  const taxAmount = calcTax.getTax(amount)

  const unit = format.denom(denom, whitelist)

  /* render */
  const fields: Field[] = [
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
      ...getDefaultProps('input'),
      label: t('Common:Tx:Amount'),
      button: {
        label: t('Common:Account:Available'),
        display: format.display(
          { amount: maxAmount, denom },
          whitelist?.[denom]?.decimals
        ),
        attrs: {
          onClick: () =>
            setValue('input', toInput(maxAmount, whitelist?.[denom]?.decimals)),
        },
      },
      attrs: {
        ...getDefaultAttrs('input'),
        type: 'number',
        placeholder: '0',
      },
      unit,
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

  const isInvalidAmount =
    gt(amount, maxAmount) || _.isEmpty(amount) || _.toNumber(amount) <= 0
  const disabled = invalid || isInvalidAmount

  const formUI = {
    title: t('Post:Send:Send {{unit}}', { unit }),
    fields,
    disabled,
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => setSubmitted(true),
  }

  const contents: ConfirmContent[] = ([] as ConfirmContent[])
    .concat([
      {
        name: t('Post:Send:Send to'),
        text: to,
      },
      {
        name: t('Common:Tx:Amount'),
        displays: [
          is.nativeDenom(denom)
            ? format.display({ amount, denom })
            : { value: input, unit: whitelist?.[denom].symbol ?? '' },
        ],
      },
    ])
    .concat(
      shouldTax
        ? {
            name: calcTax.label,
            displays: [format.display({ amount: taxAmount, denom })],
          }
        : []
    )
    .concat(memo ? { name: t('Common:Tx:Memo'), text: memo } : [])

  const getConfirm = (bank: BankData, whitelist: Whitelist): ConfirmProps => ({
    msgs: is.nativeDenom(denom)
      ? [new MsgSend(user.address, to, amount + denom)]
      : [
          new MsgExecuteContract(user.address, denom, {
            transfer: { recipient: to, amount },
          }),
        ],
    tax: shouldTax ? new Coin(denom, taxAmount) : undefined,
    memo,
    contents,
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: StationCoin) =>
      is.nativeDenom(denom)
        ? isAvailable(
            { amount, denom, fee, tax: { amount: taxAmount, denom } },
            bank.balance
          )
        : isFeeAvailable(fee, bank.balance),
    submitLabels: [t('Post:Send:Send'), t('Post:Send:Sending...')],
    message: t('Post:Send:Sent {{coin}} to {{address}}', {
      coin: format.coin(
        { amount, denom },
        whitelist?.[denom]?.decimals,
        undefined,
        whitelist
      ),
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
    confirm: bank ? getConfirm(bank, whitelist ?? {}) : undefined,
    ui: txsResponse.data && renderRecent(txsResponse.data),
  }
}

/* helper */
type RecentSentItem = { date: string; values: Omit<Values, 'network'> }
const findRecent = (txs: Tx[], denom: string): RecentSentItem[] | undefined => {
  const reduced = txs.reduce<Dictionary<RecentSentItem>>(
    (acc, { msgs: [{ text, out }], memo, timestamp }) => {
      try {
        const to = last(text.split(' to '))
        const coin = out![0]

        return coin.denom === denom && to && !acc[to] && is.address(to)
          ? {
              ...acc,
              [to]: {
                date: format.date(timestamp),
                values: { to, input: toInput(coin.amount), memo },
              },
            }
          : acc
      } catch {
        return acc
      }
    },
    {}
  )

  return Object.values(reduced)
}
