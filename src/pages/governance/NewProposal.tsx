import React, { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { times, div, floor, gt } from '../../api/math'
import useValidate from '../../api/validate'
import { getSize, find } from '../../utils'
import { useForm, useAuth } from '../../hooks'
import Amount from '../../components/Amount'
import Select from '../../components/Select'
import Divider from '../../components/Divider'
import ModalContent from '../../components/ModalContent'
import InvalidFeedback from '../../components/InvalidFeedback'
import Confirmation from '../Confirmation'

enum TypeKey {
  DEFAULT = '',
  T = 'tax_rate_update',
  R = 'reward_weight_update',
  C = 'community_pool_spend',
  P = 'param_change'
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

interface Props {
  max: string
  communityPool: Coin[]
  onSubmitting: (b: boolean) => void
  onSubmit: () => void
}

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

const NewProposal = ({ max, communityPool, onSubmitting, onSubmit }: Props) => {
  const { t } = useTranslation()
  const { address } = useAuth()
  const v = useValidate()

  const TypesList = [
    {
      key: TypeKey.DEFAULT,
      title: t('Text Proposal'),
      url: '/gov/proposals'
    },
    {
      key: TypeKey.T,
      title: t('Tax-rate Update'),
      url: '/gov/proposals/tax_rate_update'
    },
    {
      key: TypeKey.R,
      title: t('Reward-weight Update'),
      url: '/gov/proposals/reward_weight_update'
    },
    {
      key: TypeKey.C,
      title: t('Community-pool Spend'),
      url: '/gov/proposals/community_pool_spend'
    },
    {
      key: TypeKey.P,
      title: t('Parameter-change'),
      url: '/gov/proposals/param_change'
    }
  ]

  /* validation */
  const validate = (values: Values) => {
    const { typeIndex, title, description, input, ...updates } = values
    const lunaPool = find<Coin>(communityPool)('uluna')
    return Object.assign(
      {
        title: !title.length
          ? t('Title is required')
          : getSize(title) > 140
          ? t('Title is too long')
          : '',
        description: !description.length
          ? t('Description is required')
          : getSize(description) > 5000
          ? t('Description is too long')
          : '',
        input: !input || input === '0' ? '' : v.input(input, max)
      },
      {
        [TypeKey.DEFAULT]: {
          proposal_type: ''
        },
        [TypeKey.T]: {
          tax_rate: v.between({
            input: updates.tax_rate,
            range: [0, 1],
            label: t('Tax-rate')
          })
        },
        [TypeKey.R]: {
          reward_weight: v.between({
            input: updates.reward_weight,
            range: [0, 1],
            label: t('Reward-weight')
          })
        },
        [TypeKey.C]: {
          recipient: v.address(updates.recipient),
          amount: !lunaPool
            ? t("Community pool doesn't exist")
            : v.between({
                input: updates.amount,
                range: [0, lunaPool.amount],
                formatAmount: true
              })
        },
        [TypeKey.P]: {
          changes: !updates.changes
            ? t('Changes are required')
            : !validateChanges(updates.changes)
            ? t('Invalid')
            : ''
        }
      }[TypesList[typeIndex].key]
    )
  }

  /* state: form */
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
    changes: ''
  }

  const form = useForm<Values>({ initial, validate })
  const { values, handleChange, changeValue, touched, error, invalid } = form
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { typeIndex, title, description, input, ...updates } = values
  const amount = times(input || 0, 1e6)

  /* helpers: form */
  const setToMax = () => changeValue({ input: String(div(floor(max), 1e6)) })

  /* submit: tx */
  const submit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  /* isSubmitting */
  const handleSubmitting = (b: boolean) => {
    onSubmitting(b)
    setIsSubmitting(b)
  }

  /* render */
  const renderCustomField = (typeKey: TypeKey) => {
    const ui = {
      [TypeKey.DEFAULT]: null,
      [TypeKey.T]: (
        <section className="form-group">
          <label className="label">{t('Tax-rate')}</label>
          <input
            type="text"
            name="tax_rate"
            value={updates.tax_rate}
            onChange={handleChange}
            placeholder="0"
            className="form-control"
            autoComplete="off"
          />
          {renderError('tax_rate')}
        </section>
      ),
      [TypeKey.R]: (
        <section className="form-group">
          <label className="label">{t('Reward-weight')}</label>
          <input
            type="text"
            name="reward_weight"
            value={updates.reward_weight}
            onChange={handleChange}
            placeholder="0"
            className="form-control"
            autoComplete="off"
          />
          {renderError('reward_weight')}
        </section>
      ),
      [TypeKey.C]: (
        <>
          <section className="form-group">
            <label className="label">{t('Recipient')}</label>
            <input
              type="text"
              name="recipient"
              value={updates.recipient}
              onChange={handleChange}
              placeholder="0"
              className="form-control"
              autoComplete="off"
            />
            {renderError('recipient')}
          </section>

          <section className="form-group">
            <label className="label">{t('Amount')}</label>
            <div className="input-group">
              <input
                type="text"
                name="amount"
                value={updates.amount}
                onChange={handleChange}
                placeholder="0"
                className="form-control"
                autoComplete="off"
              />
              <div className="input-group-append">
                <span className="input-group-text">Luna</span>
              </div>
            </div>
            {renderError('amount')}
          </section>
        </>
      ),
      [TypeKey.P]: (
        <section className="form-group">
          <label className="label">{t('Changes')}</label>
          <textarea
            name="updates"
            value={updates.changes}
            onChange={e => changeValue({ changes: e.target.value })}
            placeholder={CHANGES_PLACEHOLDER}
            rows={6}
            className="form-control"
            autoComplete="off"
          />
          {renderError('changes')}
        </section>
      )
    }
    return ui[typeKey]
  }

  const renderError = (key: string) =>
    touched[key] && <InvalidFeedback tooltip>{error[key]}</InvalidFeedback>

  return (
    <ModalContent
      close={onSubmit}
      goBack={isSubmitted ? () => setIsSubmitted(false) : undefined}
      disabled={isSubmitting}
    >
      {!isSubmitted ? (
        <form onSubmit={submit}>
          <h1>{t('New proposal')}</h1>

          <section className="form-group">
            <label className="label">{t('Type')}</label>
            <Select
              name="typeIndex"
              value={String(typeIndex)}
              onChange={e => changeValue({ typeIndex: Number(e.target.value) })}
              className="form-control"
            >
              {TypesList.map(({ title, key }, index) => (
                <option value={index} key={key}>
                  {title}
                </option>
              ))}
            </Select>
          </section>

          <section className="form-group">
            <label className="label">{t('Title')}</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder=""
              className="form-control"
              autoComplete="off"
              autoFocus
            />
            {renderError('title')}
          </section>

          <section className="form-group">
            <label className="label">{t('Description')}</label>
            <textarea
              name="description"
              value={description}
              onChange={e => changeValue({ [e.target.name]: e.target.value })}
              rows={3}
              className="form-control"
              autoComplete="off"
            />
            {renderError('description')}
          </section>

          <section className="form-group">
            <header className="flex space-between">
              <label className="label">
                {t('Initial deposit')} ({t('Optional')})
              </label>
              <p className="label-text">
                {t('Available')}:
                <button type="button" onClick={setToMax} className="btn-link">
                  <Amount>{max}</Amount>
                </button>
              </p>
            </header>
            <div className="input-group">
              <input
                type="text"
                name="input"
                value={input}
                onChange={handleChange}
                placeholder="0"
                className="form-control"
                autoComplete="off"
              />
              <div className="input-group-append">
                <span className="input-group-text">Luna</span>
              </div>
            </div>
            {renderError('input')}
          </section>

          {renderCustomField(TypesList[typeIndex].key)}

          <Divider />
          <button
            type="submit"
            disabled={invalid}
            className="btn btn-block btn-primary"
          >
            {t('Next')}
          </button>
        </form>
      ) : (
        <Confirmation
          url={TypesList[typeIndex].url}
          amount={amount}
          denom="uluna"
          payload={{
            title,
            description,
            proposer: address,
            [(!typeIndex ? 'initial_' : '') + 'deposit']: gt(amount, 0)
              ? [{ denom: 'uluna', amount }]
              : [],
            ...sanitize(TypesList[typeIndex].key, updates)
          }}
          label={['Propose', 'Proposing']}
          message={`Created proposal ${title} with ${input || 0} Luna deposit`}
          onSubmitting={handleSubmitting}
          onFinish={onSubmit}
        />
      )}
    </ModalContent>
  )
}

export default NewProposal

/* helpers */
const validateChanges = (changes: string) => {
  try {
    const parsed: Change[] = JSON.parse(changes)
    return Array.isArray(parsed) && parsed.every(o => typeof o === 'object')
  } catch {
    return false
  }
}

const sanitize = (typeKey: TypeKey, updates: CustomField) => {
  const { proposal_type, tax_rate, reward_weight } = updates
  const { recipient, amount, changes } = updates

  return {
    [TypeKey.DEFAULT]: { proposal_type },
    [TypeKey.T]: { tax_rate },
    [TypeKey.R]: { reward_weight },
    [TypeKey.C]: {
      recipient,
      amount: [{ denom: 'uluna', amount: times(amount || 0, 1e6) }]
    },
    [TypeKey.P]: { changes: JSON.parse(changes || '[]') }
  }[typeKey]
}
