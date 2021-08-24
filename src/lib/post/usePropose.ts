import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PostPage, ConfirmProps, BankData } from '../types'
import { Coin, User, Field } from '../types'
import { format, find, gt } from '../utils'
import { toAmount, toInput } from '../utils/format'
import useFCD from '../api/useFCD'
import useBank from '../api/useBank'
import useForm from '../hooks/useForm'
import validateForm from './validateForm'
import { isAvailable, getFeeDenomList } from './validateConfirm'

enum TypeKey {
  DEFAULT = '',
  T = 'tax_rate_update',
  R = 'reward_weight_update',
  C = 'community_pool_spend',
  P = 'param_change',
}

interface Change {
  subspace: string
  key: string
  subkey: string
  value: object
}

const CHANGES_PLACEHOLDER = `[{
  "subspace": "staking",
  "key": "MaxValidators",
  "subkey": "",
  "value": {}
}]`

interface CustomField {
  proposal_type: string
  tax_rate: string
  reward_weight: string
  recipient: string
  amount: string
  changes: string
}

interface Values extends CustomField {
  typeIndex: number
  title: string
  description: string
  input: string
}

type Pool = { result: Coin[] }
const denom = 'uluna'
export default (user: User): PostPage => {
  const { t } = useTranslation()
  const v = validateForm(t)
  const url = '/distribution/community_pool'
  const { data: bank, loading, error } = useBank(user)
  const { data: pool, ...poolResponse } = useFCD<Pool>({ url })
  const { loading: poolLoading, error: poolError } = poolResponse
  const lunaPool = find('uluna:amount', pool?.result)

  const TypesList = [
    {
      key: TypeKey.DEFAULT,
      title: t('Post:Governance:Text Proposal'),
      url: '/gov/proposals',
    },
    {
      key: TypeKey.T,
      title: t('Post:Governance:Tax-rate Update'),
      url: '/gov/proposals/tax_rate_update',
    },
    {
      key: TypeKey.R,
      title: t('Post:Governance:Reward-weight Update'),
      url: '/gov/proposals/reward_weight_update',
    },
    {
      key: TypeKey.C,
      title: t('Post:Governance:Community-pool Spend'),
      url: '/gov/proposals/community_pool_spend',
    },
    {
      key: TypeKey.P,
      title: t('Post:Governance:Parameter-change'),
      url: '/gov/proposals/param_change',
    },
  ]

  /* max */
  const available = find(`${denom}:available`, bank?.balance) ?? '0'
  const max = { amount: available, denom }

  /* form */
  const validate = (values: Values) => {
    const { typeIndex, title, description, input, ...updates } = values
    const { key } = TypesList[typeIndex]

    return {
      title: !title.length
        ? t('Common:Validate:{{label}} is required', {
            label: t('Post:Governance:Title'),
          })
        : v.length(title, { max: 140, label: t('Post:Governance:Title') }),
      description: !description.length
        ? t('Common:Validate:{{label}} is required', {
            label: t('Post:Governance:Description'),
          })
        : v.length(description, {
            max: 5000,
            label: t('Post:Governance:Description'),
          }),
      input:
        !input || input === '0'
          ? ''
          : v.input(input, { max: toInput(max.amount) }),
      typeIndex: '',
      proposal_type: '',
      tax_rate:
        key === TypeKey.T
          ? v.between(updates.tax_rate, {
              range: [0, 1],
              label: t('Post:Governance:Tax-rate'),
            })
          : '',
      reward_weight:
        key === TypeKey.R
          ? v.between(updates.reward_weight, {
              range: [0, 1],
              label: t('Post:Governance:Reward-weight'),
            })
          : '',
      recipient: key === TypeKey.C ? v.address(updates.recipient) : '',
      amount:
        key === TypeKey.C
          ? !lunaPool
            ? t("Common:Validate:{{label}} doesn't exist", {
                label: t('Post:Governance:Community pool'),
              })
            : v.between(updates.amount, {
                range: [0, lunaPool],
                label: t('Post:Governance:Community pool'),
              })
          : '',
      changes:
        key === TypeKey.P
          ? !updates.changes
            ? t('Common:Validate:{{label}} are required', {
                label: t('Post:Governance:Changes'),
              })
            : !validateChanges(updates.changes)
            ? t('Common:Validate:Invalid')
            : ''
          : '',
    }
  }

  const initial = {
    typeIndex: 0,
    title: '',
    description: '',
    input: '',

    proposal_type: 'text',
    tax_rate: '',
    reward_weight: '',
    recipient: '',
    amount: '',
    changes: '',
  }

  const [submitted, setSubmitted] = useState(false)
  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid, getDefaultProps, getDefaultAttrs } = form
  const { typeIndex, input, title, description } = values
  const amount = toAmount(input)

  /* render */
  const unit = format.denom(denom)

  const customField: Field[] = {
    [TypeKey.DEFAULT]: [],
    [TypeKey.T]: [
      {
        ...getDefaultProps('tax_rate'),
        label: t('Post:Governance:Tax-rate'),
        attrs: { ...getDefaultAttrs('tax_rate'), placeholder: '0' },
      },
    ],
    [TypeKey.R]: [
      {
        ...getDefaultProps('reward_weight'),
        label: t('Post:Governance:Reward-weight'),
        attrs: { ...getDefaultAttrs('reward_weight'), placeholder: '0' },
      },
    ],
    [TypeKey.C]: [
      {
        ...getDefaultProps('recipient'),
        label: t('Post:Governance:Recipient'),
        attrs: { ...getDefaultAttrs('recipient'), placeholder: '0' },
      },
      {
        ...getDefaultProps('amount'),
        label: t('Common:Tx:Amount'),
        attrs: { ...getDefaultAttrs('amount'), placeholder: '0' },
        unit,
      },
    ],
    [TypeKey.P]: [
      {
        ...getDefaultProps('changes'),
        label: t('Post:Governance:Changes'),
        element: 'textarea' as const,
        attrs: {
          ...getDefaultAttrs('changes'),
          placeholder: CHANGES_PLACEHOLDER,
        },
      },
    ],
  }[TypesList[typeIndex].key]

  const fields: Field[] = [
    {
      ...getDefaultProps('typeIndex'),
      label: t('Common:Type'),
      element: 'select',
      attrs: getDefaultAttrs('typeIndex'),
      options: TypesList.map(({ title }, index) => ({
        value: String(index),
        children: title,
      })),
    },
    {
      ...getDefaultProps('title'),
      label: t('Post:Governance:Title'),
      attrs: { ...getDefaultAttrs('title'), autoFocus: true },
    },
    {
      ...getDefaultProps('description'),
      label: t('Post:Governance:Description'),
      element: 'textarea',
      attrs: getDefaultAttrs('description'),
    },
    {
      ...getDefaultProps('input'),
      label: [
        t('Post:Governance:Initial deposit'),
        `(${t('Common:Form:Optional')})`,
      ].join(' '),
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
    ...customField,
  ]

  const getConfirm = (bank: BankData): ConfirmProps => ({
    url: TypesList[typeIndex].url,
    payload: {
      title,
      description,
      proposer: user.address,
      [(!typeIndex ? 'initial_' : '') + 'deposit']: gt(amount, 0)
        ? [{ amount, denom }]
        : [],
      ...sanitize(TypesList[typeIndex].key, values),
    },
    contents: input
      ? [
          {
            name: t('Post:Governance:Initial deposit'),
            displays: [format.display({ amount, denom })],
          },
        ]
      : [],
    warning: [
      'It is recommended to get community feedback on https://agora.terra.money before uploading any proposal',
      'Do not use text proposals to suggest Parameter changes',
      'LUNA proposal deposits are not refunded if the quorum is not reached or the poll result is NoWithVeto',
    ],
    feeDenom: { list: getFeeDenomList(bank.balance) },
    validate: (fee: Coin) => isAvailable({ amount, denom, fee }, bank.balance),
    submitLabels: [
      t('Post:Governance:Propose'),
      t('Post:Governance:Proposing...'),
    ],
    message: t(
      input
        ? 'Post:Governance:Created proposal {{title}} with {{coin}} deposit'
        : 'Post:Governance:Created proposal {{title}} without deposit',
      { title, coin: format.coin({ amount, denom }) }
    ),
    cancel: () => setSubmitted(false),
  })

  const disabled = invalid

  const formUI = {
    fields,
    disabled,
    title: t('Page:Governance:New proposal'),
    submitLabel: t('Common:Form:Next'),
    onSubmit: disabled ? undefined : () => setSubmitted(true),
  }

  return {
    error: error || poolError,
    loading: loading || poolLoading,
    submitted,
    form: formUI,
    confirm: bank && getConfirm(bank),
  }
}

/* helpers */
const validateChanges = (changes: string) => {
  try {
    const parsed: Change[] = JSON.parse(changes)
    return Array.isArray(parsed) && parsed.every((o) => typeof o === 'object')
  } catch {
    return false
  }
}

const sanitize = (typeKey: TypeKey, values: Values) => {
  const { proposal_type, tax_rate, reward_weight } = values
  const { recipient, amount, changes } = values

  return {
    [TypeKey.DEFAULT]: { proposal_type },
    [TypeKey.T]: { tax_rate },
    [TypeKey.R]: { reward_weight },
    [TypeKey.C]: {
      recipient,
      amount: [{ denom: 'uluna', amount: toAmount(amount) }],
    },
    [TypeKey.P]: {
      changes: validateChanges(changes) ? JSON.parse(changes) : [],
    },
  }[typeKey]
}
