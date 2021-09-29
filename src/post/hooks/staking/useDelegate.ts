import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MsgDelegate, MsgBeginRedelegate } from '@terra-money/terra.js'
import { MsgUndelegate, Coin } from '@terra-money/terra.js'
import { PostPage, ConfirmProps, StakingData, BankData } from '../../../types'
import { CoinItem, Field, FieldElement } from '../../../types'
import { format } from '../../../utils'
import { toAmount, toInput } from '../../../utils/format'
import { useAddress } from '../../../data/auth'
import useFCD from '../../../api/useFCD'
import useBank from '../../../api/useBank'
import useForm from '../../../hooks/useForm'
import validateForm from '../validateForm'
import { isDelegatable, isFeeAvailable } from '../validateConfirm'
import { getFeeDenomList } from '../validateConfirm'

interface Values {
  from: string
  input: string
}

interface Props {
  validatorAddress: string
  type: DelegateType
}

export enum DelegateType {
  D = 'Delegate',
  R = 'Redelegate',
  U = 'Undelegate',
}

const denom = 'uluna'

export default ({ validatorAddress, type }: Props): PostPage => {
  const isUndelegation = type === DelegateType.U
  const isRedelegation = type === DelegateType.R

  const { t } = useTranslation()
  const v = validateForm(t)

  /* ready */
  const address = useAddress()
  const url = `/v1/staking/${address}`
  const { data: bank, loading, error } = useBank()
  const { data: staking, ...stakingResponse } = useFCD<StakingData>({ url })
  const { loading: stakingLoading, error: stakingError } = stakingResponse
  const sources = staking?.myDelegations?.filter(
    (d) => d.validatorAddress !== validatorAddress
  )

  const findDelegationFromSources = (address: string) =>
    staking?.myDelegations?.find((d) => d.validatorAddress === address)

  const findDelegationFromValidators = (address: string) =>
    staking?.validators?.find((d) => d.operatorAddress === address)

  /* max */
  const getMax = (address: string): CoinItem => {
    const amount =
      findDelegationFromSources(address)?.amountDelegated ??
      staking?.availableLuna

    return { amount: amount ?? '0', denom }
  }

  /* form */
  const validate = ({ input, from }: Values) => ({
    input: v.input(input, {
      max: toInput(getMax(isUndelegation ? validatorAddress : from).amount),
    }),
    from: type === DelegateType.R && !from ? 'Source is required' : '',
  })

  /*
  Delegation:   from = address(user) / to = validatorAddress
  Redelegation: from = address(src)  / to = validatorAddress
  Undelegation: from = address(user) / to = validatorAddress
  */

  const initial = { input: '', from: isRedelegation ? '' : address }
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid, getDefaultProps, getDefaultAttrs } = form
  const { input, from } = values
  const amount = toAmount(input)

  const moniker =
    findDelegationFromValidators(validatorAddress)?.description.moniker

  /* render */
  const unit = format.denom(denom)
  const hasSources = !!sources?.length
  const sourceLength = hasSources ? sources!.length : t('Page:Bank:My wallet')

  const fromField = {
    ...getDefaultProps('from'),
    label: t('Post:Staking:Source ({{length}})', {
      length: sourceLength,
    }),
    element: (hasSources ? 'select' : 'input') as FieldElement,
    attrs: {
      ...getDefaultAttrs('from'),
      readOnly: !hasSources,
    },
    options: !hasSources
      ? undefined
      : [
          { value: '', children: 'Choose a validator', disabled: true },
          ...sources!.map(({ validatorName, validatorAddress }) => ({
            value: validatorAddress,
            children: validatorName,
          })),
        ],
  }

  const inputField = {
    ...getDefaultProps('input'),
    label: t('Common:Tx:Amount'),
    button: {
      label: t('Common:Account:Available'),
      display: format.display(getMax(isUndelegation ? validatorAddress : from)),
      attrs: {
        onClick: () =>
          setValue(
            'input',
            toInput(getMax(isUndelegation ? validatorAddress : from).amount)
          ),
      },
    },
    attrs: {
      ...getDefaultAttrs('input'),
      type: 'number' as const,
      placeholder: '0',
      autoFocus: true,
    },
    unit,
  }

  const fields: Field[] = isRedelegation
    ? [fromField, inputField]
    : [inputField]

  const getConfirm = (bank: BankData): ConfirmProps => {
    const coin = format.coin({ amount, denom })
    const display = format.display({ amount, denom })
    const contents = [{ name: t('Common:Tx:Amount'), displays: [display] }]
    const feeDenom = { list: getFeeDenomList(bank.balance) }
    const cancel = () => setSubmitted(false)

    return {
      [DelegateType.D]: {
        contents,
        feeDenom,
        cancel,
        msgs: [
          new MsgDelegate(from, validatorAddress, new Coin(denom, amount)),
        ],
        validate: (fee: CoinItem) =>
          isDelegatable({ amount, denom, fee }, bank.balance) &&
          isFeeAvailable(fee, bank.balance),
        submitLabels: [
          t('Post:Staking:Delegate'),
          t('Post:Staking:Delegating...'),
        ],
        message: t('Post:Staking:Delegated {{coin}} to {{moniker}}', {
          coin,
          moniker,
        }),
        warning: t(
          'Post:Staking:Remember to leave a small amount of tokens undelegated, as subsequent transactions (e.g. redelegation) require fees to be paid.'
        ),
      },
      [DelegateType.R]: {
        contents,
        feeDenom,
        cancel,
        msgs: [
          new MsgBeginRedelegate(
            address,
            from,
            validatorAddress,
            new Coin(denom, amount)
          ),
        ],
        validate: (fee: CoinItem) => isFeeAvailable(fee, bank.balance),
        submitLabels: [
          t('Post:Staking:Redelegate'),
          t('Post:Staking:Redelegating...'),
        ],
        message: t('Post:Staking:Redelegated {{coin}} to {{moniker}}', {
          coin,
          moniker,
        }),
        warning:
          'Redelegation from the recipient validator will be blocked for 21 days after this transaction.',
      },
      [DelegateType.U]: {
        contents,
        feeDenom,
        cancel,
        msgs: [
          new MsgUndelegate(from, validatorAddress, new Coin(denom, amount)),
        ],
        validate: (fee: CoinItem) => isFeeAvailable(fee, bank.balance),
        submitLabels: [
          t('Post:Staking:Undelegate'),
          t('Post:Staking:Undelegating...'),
        ],
        message: t('Post:Staking:Undelegated {{coin}} from {{moniker}}', {
          coin,
          moniker,
        }),
        warning: t(
          'Post:Staking:Undelegation takes 21 days to complete. You would not get rewards in the meantime.'
        ),
      },
    }[type]
  }

  const disabled = invalid

  const formUI = {
    fields,
    disabled,
    title: t('Post:Staking:' + type),
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => setSubmitted(true),
  }

  return {
    error: error || stakingError,
    loading: loading || stakingLoading,
    submitted,
    form: formUI,
    confirm: bank && getConfirm(bank),
  }
}
