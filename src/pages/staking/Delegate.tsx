import React, { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { times, div, floor } from '../../api/math'
import useValidate from '../../api/validate'
import { format } from '../../utils'
import { useAuth, useForm } from '../../hooks'
import Amount from '../../components/Amount'
import Select from '../../components/Select'
import WithRequest from '../../components/WithRequest'
import ModalContent from '../../components/ModalContent'
import InvalidFeedback from '../../components/InvalidFeedback'
import Divider from '../../components/Divider'
import Confirmation from '../Confirmation'
import s from './Delegate.module.scss'

enum Type {
  D = 'DELEGATE',
  R = 'REDELEGATE',
  U = 'UNDELEGATE'
}

type Props = {
  undelegate: boolean
  to: string
  moniker: string
  max: string
  onDelegating: (b: boolean) => void
  onDelegate: () => void
}

type FormProps = {
  sources: StakingDelegation[]
  findRedelegation: (address: string) => StakingDelegation | undefined
  getMax: (address: string) => string
}

const Form = (props: Props & FormProps) => {
  const denom = 'uluna'
  const { sources, findRedelegation, getMax } = props
  const { undelegate, to, moniker } = props
  const { onDelegating, onDelegate } = props

  const { t } = useTranslation()
  const { address } = useAuth()
  const v = useValidate()

  /* validation */
  type Values = { input: string; from: string }
  const validate = ({ input, from }: Values) => ({
    input: v.input(input, getMax(from))
  })

  /* forms */
  const initial = { input: '', from: address }
  const form = useForm<Values>({ initial, validate })
  const { values, changeValue, handleChange, touched, error, invalid } = form
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isDelegating, setIsDelegating] = useState<boolean>(false)
  const { input, from } = values
  const amount = times(input || 0, 1e6)
  const redelegation = findRedelegation(from)
  const type = redelegation ? Type.R : undelegate ? Type.U : Type.D
  const max = getMax(from)

  /* helpers: form */
  const setToMax = () => changeValue({ input: String(div(floor(max), 1e6)) })

  /* submit: tx */
  const submit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  /* render */
  const title = {
    [Type.D]: 'Delegate',
    [Type.U]: 'Undelegate',
    [Type.R]: 'Redelegate'
  }[type]

  const confirmation = {
    [Type.D]: {
      url: `/staking/delegators/${from}/delegations`,
      payload: {
        delegator_address: from,
        validator_address: to,
        amount: { amount, denom }
      },
      label: ['Delegate', 'Delegating'],
      message: `Delegated ${input} ${format.denom(denom)} to ${moniker}`
    },
    [Type.U]: {
      url: `/staking/delegators/${from}/unbonding_delegations`,
      payload: {
        delegator_address: from,
        validator_address: to,
        amount: { amount, denom }
      },
      warning: t(
        'Undelegation takes 21 days to complete. You would not get rewards in the meantime.'
      ),
      label: ['Undelegate', 'Undelegating'],
      message: `Undelegated ${input} ${format.denom(denom)} from ${moniker}`
    },
    [Type.R]: {
      url: `/staking/delegators/${from}/redelegations`,
      payload: {
        delegator_address: address,
        validator_src_address: from,
        validator_dst_address: to,
        amount: { amount, denom }
      },
      warning: t(
        'Redelegation to the same validator will be prohibited for 21 days. Please make sure you input the right amount of luna to delegate.'
      ),
      label: ['Redelegate', 'Redelegating'],
      message: redelegation
        ? `Redelegated ${input} ${format.denom(denom)} from ${
            redelegation.validatorName
          } to ${moniker}`
        : `Redelegated ${input} ${format.denom(denom)} to ${moniker}`
    }
  }[type]

  const sourceLength = !!sources.length ? sources.length + 1 : 'My wallet'

  const handleDelegating = (b: boolean) => {
    onDelegating(b)
    setIsDelegating(b)
  }

  const renderError = (key: string) =>
    touched[key] && <InvalidFeedback tooltip>{error[key]}</InvalidFeedback>

  return (
    <ModalContent
      close={onDelegate}
      goBack={isSubmitted ? () => setIsSubmitted(false) : undefined}
      disabled={isDelegating}
    >
      {!isSubmitted ? (
        <form onSubmit={submit}>
          <h1>{t(title)}</h1>

          {!undelegate ? (
            <section className="form-group">
              <label className="label">
                {t('Source')} ({sourceLength})
              </label>
              {!!sources.length ? (
                <Select
                  name="from"
                  value={from}
                  onChange={handleChange}
                  className={c('form-control', s.select)}
                >
                  <option value={address}>
                    {t('My wallet')} - {address}
                  </option>
                  {sources.map(({ validatorName, validatorAddress }, i) => (
                    <option value={validatorAddress} key={i}>
                      {`${validatorName} - ${validatorAddress}`}
                    </option>
                  ))}
                </Select>
              ) : (
                <input
                  type="text"
                  defaultValue={from}
                  className="form-control"
                  autoComplete="off"
                  readOnly
                />
              )}
            </section>
          ) : (
            <section className="form-group">
              <label className="label">{t('Undelegate from')}</label>
              <input
                type="text"
                value={to}
                className="form-control"
                autoComplete="off"
                readOnly
              />
            </section>
          )}

          <section className="form-group">
            <header className="flex space-between">
              <label className="label">{t('Amount')}</label>
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
                autoFocus
              />
              <div className="input-group-append">
                <span className="input-group-text">Luna</span>
              </div>
            </div>
            {renderError('input')}
          </section>

          {!undelegate && (
            <section className="form-group">
              <label className="label">{t('Delegate to')}</label>
              <input
                type="text"
                value={to}
                className="form-control"
                autoComplete="off"
                readOnly
              />
            </section>
          )}

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
          {...confirmation}
          denom={denom}
          amount={amount}
          onSubmitting={handleDelegating}
          onFinish={onDelegate}
        />
      )}
    </ModalContent>
  )
}

const Delegate = (props: Props) => {
  const { address } = useAuth()
  return (
    <WithRequest url={`/v1/staking/${address}`} loading="Loading…">
      {({ myDelegations }: Staking) => {
        const sources = myDelegations
          ? myDelegations.filter(d => d.validatorAddress !== props.to)
          : []

        const findRedelegation = (from: string) =>
          myDelegations
            ? myDelegations.find(d => d.validatorAddress === from)
            : undefined

        const getMax = (from: string): string => {
          const redelegation = findRedelegation(from)
          return redelegation ? redelegation.amountDelegated : props.max
        }

        return (
          <Form
            {...props}
            sources={sources}
            findRedelegation={findRedelegation}
            getMax={getMax}
          />
        )
      }}
    </WithRequest>
  )
}

export default Delegate
