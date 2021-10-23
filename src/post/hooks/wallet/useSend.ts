import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import { MsgExecuteContract, MsgSend } from '@terra-money/terra.js'
import { Coin } from '@terra-money/terra.js'
import { BankData, Whitelist } from '../../../types'
import { PostPage, CoinItem, Field } from '../../../types'
import { ConfirmContent, ConfirmProps } from '../../../types'
import { is, format, find } from '../../../utils'
import { gt, max, minus } from '../../../utils/math'
import { toAmount, toInput } from '../../../utils/format'
import { useAddress } from '../../../data/auth'
import { useDenomTrace } from '../../../data/lcd/ibc'
import { TokenBalanceQuery } from '../../../cw20/useTokenBalance'
import useBank from '../../../api/useBank'
import useForm from '../../../hooks/useForm'
import validateForm from '../validateForm'
import { isAvailable, isFeeAvailable } from '../validateConfirm'
import { getFeeDenomList } from '../validateConfirm'
import { useCalcFee } from '../txHelpers'
import useCalcTax from '../useCalcTax'

interface Values {
  to: string
  input: string
  memo: string
}

export default (denom: string, tokenBalance: TokenBalanceQuery): PostPage => {
  const { t } = useTranslation()
  const address = useAddress()
  const { data: bank, loading: bankLoading, error } = useBank()
  const { list, loading: tokenLoading, tokens } = tokenBalance
  const loading = bankLoading || tokenLoading
  const v = validateForm(t)
  const { data: denomTrace } = useDenomTrace(denom)
  const ibcDenom = denomTrace?.base_denom

  /* form */
  const getBalance = () =>
    (is.nativeDenom(denom) || is.ibcDenom(denom)
      ? find(`${denom}:available`, bank?.balance)
      : list?.find(({ token }) => token === denom)?.balance) ?? '0'

  const validate = ({ input, to, memo }: Values) => ({
    to: v.address(to),
    input: v.input(
      input,
      { max: toInput(getBalance(), tokens?.[denom]?.decimals) },
      tokens?.[denom]?.decimals
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
  const amount = toAmount(input, tokens?.[denom]?.decimals)

  /* tax */
  const [submitted, setSubmitted] = useState(false)
  const shouldTax = is.nativeTerra(denom) || is.ibcDenom(denom)
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

  const unit = format.denom(denom, tokens)

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
      ...getDefaultProps('input'),
      label: t('Common:Tx:Amount'),
      button: {
        label: t('Common:Account:Available'),
        display: format.display(
          { amount: maxAmount, denom },
          tokens?.[denom]?.decimals
        ),
        attrs: {
          onClick: () =>
            setValue('input', toInput(maxAmount, tokens?.[denom]?.decimals)),
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

  const fields = defaultFields

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
          is.ibcDenom(denom)
            ? {
                value: format.amount(amount),
                unit: format.denom(ibcDenom) || ibcDenom || denom,
              }
            : is.nativeDenom(denom)
            ? format.display({ amount, denom })
            : { value: input, unit: tokens?.[denom].symbol ?? '' },
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
    msgs:
      is.nativeDenom(denom) || is.ibcDenom(denom)
        ? [new MsgSend(address, to, [new Coin(denom, amount)])]
        : [
            new MsgExecuteContract(address, denom, {
              transfer: { recipient: to, amount },
            }),
          ],
    tax: shouldTax ? new Coin(denom, taxAmount) : undefined,
    memo,
    contents,
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: CoinItem) =>
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
    confirm: bank ? getConfirm(bank, tokens ?? {}) : undefined,
  }
}
