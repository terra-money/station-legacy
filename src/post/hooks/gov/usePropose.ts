import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PostPage, ConfirmProps, BankData } from '../../../types'
import { CoinItem, Field } from '../../../types'
import { format, find, gt } from '../../../utils'
import { parseJSON, toAmount, toInput } from '../../../utils/format'
import { useAddress } from '../../../data/auth'
import useFCD from '../../../api/useFCD'
import useBank from '../../../api/useBank'
import useForm from '../../../hooks/useForm'
import validateForm from '../validateForm'
import { isAvailable, getFeeDenomList } from '../validateConfirm'
import { Coins, MsgSubmitProposal } from '@terra-money/terra.js'
import {
  TextProposal,
  CommunityPoolSpendProposal,
  ParameterChangeProposal,
} from '@terra-money/terra.js'
import { useTns } from '../../../hooks/useTns'

enum TypeKey {
  TEXT = '',
  COMMUNITY_POOL_SPEND = 'community_pool_spend',
  PARAM_CHANGE = 'param_change',
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
  "value": "100"
}]`

interface CustomField {
  proposal_type: string
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

type Pool = { result: CoinItem[] }
const denom = 'uluna'
export default (): PostPage => {
  const { t } = useTranslation()
  const address = useAddress()
  const v = validateForm(t)
  const url = '/distribution/community_pool'
  const { data: bank, loading, error } = useBank()
  const { data: pool, ...poolResponse } = useFCD<Pool>({ url })
  const { loading: poolLoading, error: poolError } = poolResponse

  const {
    address: resolvedAddress,
    error: tnsError,
    resolve: resolveTns,
  } = useTns()

  const lunaPool = find('uluna:amount', pool?.result)

  const TypesList = [
    {
      key: TypeKey.TEXT,
      title: t('Post:Governance:Text Proposal'),
    },
    {
      key: TypeKey.COMMUNITY_POOL_SPEND,
      title: t('Post:Governance:Community-pool Spend'),
    },
    {
      key: TypeKey.PARAM_CHANGE,
      title: t('Post:Governance:Parameter-change'),
    },
  ]

  /* max */
  const available = find(`${denom}:available`, bank?.balance) ?? '0'
  const max = { amount: available, denom }

  /* form */
  const validate = (values: Values) => {
    const { typeIndex, title, description, input, ...updates } = values
    const { key } = TypesList[typeIndex]

    const recipient = resolvedAddress || updates.recipient
    const recipientErr = tnsError || v.address(recipient)

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
      recipient: key === TypeKey.COMMUNITY_POOL_SPEND ? recipientErr : '',
      amount:
        key === TypeKey.COMMUNITY_POOL_SPEND
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
        key === TypeKey.PARAM_CHANGE
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
    recipient: '',
    amount: '',
    changes: '',
  }

  const [submitted, setSubmitted] = useState(false)
  const form = useForm<Values>(initial, validate)
  const { values, setValue, invalid, getDefaultProps, getDefaultAttrs } = form
  const { typeIndex, input, title, recipient } = values
  const amount = toAmount(input)

  useEffect(() => {
    resolveTns(recipient)
  }, [recipient, resolveTns])

  /* render */
  const unit = format.denom(denom)

  const customField: Field[] = {
    [TypeKey.TEXT]: [],
    [TypeKey.COMMUNITY_POOL_SPEND]: [
      {
        ...getDefaultProps('recipient'),
        label: t('Post:Governance:Recipient'),
        helper: resolvedAddress,
        attrs: { ...getDefaultAttrs('recipient'), placeholder: '0' },
      },
      {
        ...getDefaultProps('amount'),
        label: t('Common:Tx:Amount'),
        attrs: { ...getDefaultAttrs('amount'), placeholder: '0' },
        unit,
      },
    ],
    [TypeKey.PARAM_CHANGE]: [
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
    msgs: [
      new MsgSubmitProposal(
        sanitize(TypesList[typeIndex].key, {
          ...values,
          recipient: resolvedAddress || values.recipient,
        }),
        new Coins(gt(amount, 0) ? { [denom]: amount } : {}),
        address
      ),
    ],
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
    validate: (fee: CoinItem) =>
      isAvailable({ amount, denom, fee }, bank.balance),
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
    const isValueString = (o: object) =>
      Object.values(o).every((v) => typeof v === 'string')

    const parsed: Change[] = JSON.parse(changes)
    return (
      Array.isArray(parsed) &&
      parsed.every((o) => typeof o === 'object' && isValueString(o))
    )
  } catch {
    return false
  }
}

const sanitize = (typeKey: TypeKey, values: Values) => {
  const { title, description } = values
  const { recipient, amount, changes } = values

  return {
    [TypeKey.TEXT]: new TextProposal(title, description),
    [TypeKey.COMMUNITY_POOL_SPEND]: new CommunityPoolSpendProposal(
      title,
      description,
      recipient,
      new Coins({ uluna: toAmount(amount) })
    ),
    [TypeKey.PARAM_CHANGE]: new ParameterChangeProposal(
      title,
      description,
      validateChanges(changes) ? parseJSON(changes) : []
    ),
  }[typeKey]
}
