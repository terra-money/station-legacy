import React, { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { times, div, floor } from '../../../api/math'
import useValidate from '../../../api/validate'
import { format } from '../../../utils'
import { useForm, useAuth } from '../../../hooks'
import Amount from '../../../components/Amount'
import Divider from '../../../components/Divider'
import CoinList from '../../../components/CoinList'
import ModalContent from '../../../components/ModalContent'
import InvalidFeedback from '../../../components/InvalidFeedback'
import Confirmation from '../../Confirmation'
import s from './Deposit.module.scss'

interface Props {
  id: string
  deposit: Deposit
  max: string
  onSubmitting: (b: boolean) => void
  onSubmit: () => void
}

interface Values {
  input: string
}

const Deposit = ({ id, deposit, max, onSubmitting, onSubmit }: Props) => {
  const { minDeposit, totalDeposit, depositEndTime } = deposit
  const { t } = useTranslation()
  const { address } = useAuth()
  const v = useValidate()

  /* validation */
  const validate = ({ input }: Values) => ({ input: v.input(input, max) })

  /* state: form */
  const form = useForm<Values>({ initial: { input: '' }, validate })
  const { values, handleChange, changeValue, touched, error, invalid } = form
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { input } = values
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
  const renderError = (key: string) =>
    touched[key] && <InvalidFeedback tooltip>{error[key]}</InvalidFeedback>

  const total = !totalDeposit.length
    ? [{ amount: '0', denom: 'uluna' }]
    : totalDeposit

  return (
    <ModalContent
      close={onSubmit}
      goBack={isSubmitted ? () => setIsSubmitted(false) : undefined}
      disabled={isSubmitting}
    >
      {!isSubmitted ? (
        <form onSubmit={submit}>
          <h1>{t('Deposit')}</h1>

          <dl className={c('dl-wrap', s.dl)}>
            <dt>{t('Total deposit')}</dt>
            <dd>{<CoinList list={total} />}</dd>

            <dt>{t('Minimum deposit')}</dt>
            <dd>
              <CoinList list={minDeposit} />
            </dd>

            <dt>{t('Deposit end time')}</dt>
            <dd>{format.date(depositEndTime)}</dd>
          </dl>

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
              />
              <div className="input-group-append">
                <span className="input-group-text">Luna</span>
              </div>
            </div>
            {renderError('input')}
          </section>

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
          url={`/gov/proposals/${id}/deposits`}
          amount={amount}
          denom="uluna"
          payload={{ depositor: address, amount: [{ denom: 'uluna', amount }] }}
          label={['Deposit', 'Depositting']}
          message={`Deposited ${input} Luna to proposal ${id}`}
          onSubmitting={handleSubmitting}
          onFinish={onSubmit}
        />
      )}
    </ModalContent>
  )
}

export default Deposit
