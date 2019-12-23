import React, { useState, useEffect, Fragment, ReactNode } from 'react'
import { FormEvent, ButtonHTMLAttributes } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import c from 'classnames'
import { OOPS } from '../helpers/constants'
import signTx from '../cosmos/api/signTx'
import getSigner from '../cosmos/signer'
import api from '../api/api'
import { GAS_PRICE, calcFee, calcGas } from '../api/calcFee'
import getBaseRequest from '../api/getBaseRequest'
import { plus, sum, times, div, gt, lte, lt, percent } from '../api/math'
import { format, find, sanitize } from '../utils'
import { parseError } from '../utils/error'
import { useAuth } from '../hooks'
import WithRequest from '../components/WithRequest'
import ProgressCircle from '../components/ProgressCircle'
import InvalidFeedback from '../components/InvalidFeedback'
import Select from '../components/Select'
import Confirm from '../components/Confirm'
import WithAuth from '../components/WithAuth'
import Divider from '../components/Divider'
import Icon from '../components/Icon'
import s from './Confirmation.module.scss'

type Props = {
  /* values: tx */
  url: string
  denom?: string
  memo?: string
  tax?: string
  taxInfo?: TaxInfo
  type?: string
  payload?: object

  /* step 1 */
  amount?: string
  amounts?: Coin[]
  receive?: Coin
  warning?: string
  label?: string[]

  /* step 2 */
  message: string
  onSubmitting?: (b: boolean) => void
  onFinish?: () => void
}

const Form = (props: Props & { balance: Balance[] }) => {
  const { t } = useTranslation()

  /* context */
  const auth = useAuth()
  const { address: from, name, withLedger } = auth

  /* props */
  const { url, denom, memo, tax = '0', taxInfo, type, payload = {} } = props
  const { amount = '0', amounts, receive, warning } = props
  const { label = ['Submit', 'Submitting'] } = props
  const { message, onSubmitting, onFinish } = props
  const { balance } = props

  /* state: component */
  const [errorMessage, setErrorMessage] = useState<string>('')
  const handleError = (error: any) => {
    const { message = OOPS } = error.response
      ? parseError(error.response.data)
      : error || {}

    setErrorMessage(message)
  }

  /* state: form */
  const [password, setPassword] = useState<string>('')
  const [incorrect, setIncorrect] = useState<string>('')
  const [ledgerError, setLedgerError] = useState<string>('')
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const handleChange = (password: string) => {
    setIncorrect('')
    setPassword(password)
  }

  /* state: simulate */
  const getInitialFeeDenom = () => denom || balance[0]?.denom || 'uluna'
  const [estimatedFeeAmount, setEstimatedFeeAmount] = useState<string>('0')
  const [input, setInput] = useState<string>('0')
  const [feeDenom, setFeeDenom] = useState<string>(getInitialFeeDenom)
  const feeAmount = times(input || 0, 1e6)
  const fee = { amount: feeAmount, denom: feeDenom }
  const gas = calcGas(fee.amount)

  /* effect: simulate */
  const [isSimulating, setIsSimulating] = useState<boolean>(true)

  useEffect(() => {
    const findAvailableDenom = (feeAmount: string) => {
      const validateWithFee = (fee: Coin) =>
        validate(label[0])({ amount, denom, tax, fee }, balance)

      return validateWithFee({ amount: feeAmount, denom: fee.denom })
        ? fee.denom
        : balance.find(({ denom }) =>
            validateWithFee({ amount: feeAmount, denom })
          )?.denom ?? fee.denom
    }

    const simulate = async () => {
      try {
        const base = await getBaseRequest(from)

        const simulationFees = { amount: '1', denom: findAvailableDenom('1') }
        const gasData = { gas: 'auto', fees: [simulationFees] }

        const body = {
          base_req: { ...base, memo, simulate: true, ...gasData },
          ...payload
        }

        const { data } = await api.post(url, body)
        const { gas_estimate } = data

        const coefficient = getCoefficient(label[0])
        const estimatedFeeAmount = calcFee(times(gas_estimate, coefficient))
        setEstimatedFeeAmount(estimatedFeeAmount)

        const input = format.decimal(div(estimatedFeeAmount, 1e6))
        setInput(input)
        setFeeDenom(findAvailableDenom(estimatedFeeAmount))

        setIsSimulating(false)
      } catch (error) {
        handleError(error)
      }
    }

    simulate()
    // eslint-disable-next-line
  }, [])

  /* submit: tx */
  const submit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    const post = async () => {
      try {
        const base = await getBaseRequest(from)
        const gasData = {
          gas,
          gas_prices: [{ amount: GAS_PRICE, denom: fee.denom }]
        }

        const body = {
          base_req: { ...base, memo, simulate: false, ...gasData },
          ...payload
        }

        const config = { headers: { 'Content-Type': 'application/json' } }
        const { data } = await api.post(url, body, config)
        const { value: tx } = data

        /* sign */
        const submitType = withLedger ? 'ledger' : 'local'
        const signer = await getSigner(submitType, { name, password })
        const signedTx = await signTx(tx, signer, { ...base, type })

        type Res = { raw_log: string }
        const { data: res } = await api.post<Res>('/v1/txs', signedTx, config)

        const errorMessage = findErrorMessage(res.raw_log)
        if (errorMessage) {
          throw Error(errorMessage)
        }

        setIsSubmitted(true)
      } catch (error) {
        error.message === 'Incorrect password'
          ? setIncorrect(t('Incorrect password'))
          : error.message && error.message.includes('Signing failed: ')
          ? setLedgerError(error.message)
          : handleError(error)
      }
    }

    e.preventDefault()
    setLedgerError('')
    setIsSubmitting(true)
    withLedger && setIsConfirming(true)
    await post()
    setIsSubmitting(false)
  }

  /* effect: prevent closing modal */
  useEffect(() => {
    onSubmitting && onSubmitting(isSubmitting)
    // eslint-disable-next-line
  }, [isSubmitting])

  /* validate */
  const invalid = !validate(label[0])({ amount, denom, tax, fee }, balance)
  const hasFee = gt(fee.amount, '0')
  const disabled = isSimulating || isSubmitting || invalid || !hasFee

  /* render */
  const formatAmount = ({ amount, denom }: Coin) => (
    <>
      <span>{format.amount(amount)}</span> <span>{format.denom(denom)}</span>
    </>
  )

  const getTaxString = ({ rate, cap }: TaxInfo, denom: string): ReactNode => (
    <small>
      ({percent(rate, 3)}, {t('Max ')}
      {format.coin({ amount: cap, denom })})
    </small>
  )

  const actions = onFinish && [
    {
      onClick: onFinish,
      children: 'Ok',
      className: 'btn btn-block btn-primary'
    }
  ]

  const submitAttrs: ButtonHTMLAttributes<HTMLButtonElement> = {
    type: 'submit',
    className: 'btn btn-block btn-primary'
  }

  return errorMessage ? (
    <Confirm icon="error_outline" title={t('Fail')} actions={actions}>
      {errorMessage}
    </Confirm>
  ) : isSimulating ? (
    <p>({t('Simulating')}...)</p>
  ) : !isSubmitted ? (
    isConfirming ? (
      <form className={s.ledger} onSubmit={submit}>
        <h1>{t('Confirm with ledger')}</h1>

        <section>
          <Icon name="usb" size={64} />
          <p>
            <Trans i18nKey="Please confirm in your Ledger Wallet">
              Please confirm in your
              <br />
              Ledger Wallet
            </Trans>
          </p>
        </section>

        <footer className="text-center">
          {!ledgerError ? (
            <ProgressCircle />
          ) : (
            <>
              <p>
                <button type="submit" className="btn btn-primary btn-sm">
                  {t('Retry')}
                </button>
              </p>
              <p>
                <small>{ledgerError}</small>
              </p>
            </>
          )}
        </footer>
      </form>
    ) : (
      <form onSubmit={submit}>
        <h1>{t('Confirm')}</h1>
        <dl className={c('dl-wrap', s.dl)}>
          {amounts
            ? amounts.map((a, i) => (
                <Fragment key={i}>
                  <dt>{!i && t('Amount')}</dt>
                  <dd>{formatAmount(a)}</dd>
                </Fragment>
              ))
            : denom && (
                <>
                  <dt>{t('Amount')}</dt>
                  <dd>{formatAmount({ amount, denom })}</dd>
                </>
              )}

          {gt(tax, 0) && taxInfo && denom && (
            <>
              <dt>
                {t('Tax')} {getTaxString(taxInfo, denom)}
              </dt>
              <dd>{formatAmount({ amount: tax, denom })}</dd>
            </>
          )}

          <dt>
            {t('Fees')}
            <Select
              name="feeDenom"
              value={fee.denom}
              onChange={e => setFeeDenom(e.target.value)}
              disabled={isSubmitting}
              className="form-control form-control-sm"
            >
              {balance.map(({ denom }, index) => (
                <option value={denom} key={index}>
                  {format.denom(denom)}
                </option>
              ))}
            </Select>
          </dt>
          <dd>
            <input
              type="text"
              name="feeAmount"
              value={input}
              onChange={e => setInput(sanitize(e.target.value))}
              disabled={isSubmitting}
              className="form-control form-control-sm"
              autoComplete="off"
            />
            <span>{format.denom(fee.denom)}</span>
          </dd>

          {memo && (
            <>
              <dt>{t('Memo')}</dt>
              <dd>{memo}</dd>
            </>
          )}

          {receive && (
            <>
              <dt>{t('Receive')}</dt>
              <dd>{formatAmount(receive)}</dd>
            </>
          )}
        </dl>

        <section className={s.feedback}>
          {lt(fee.amount, estimatedFeeAmount) && (
            <p className="text-right">
              <small>
                {t('Recommended fee is ')}
                {format.coin({ amount: estimatedFeeAmount, denom: fee.denom })}
                {t(' or higher.')}
                <br />
                {t('Transactions with low fee might fail to proceed.')}
              </small>
            </p>
          )}
          {warning && <InvalidFeedback>{warning}</InvalidFeedback>}
          {invalid && (
            <InvalidFeedback>
              {t(
                "You don't have enough balance. Please adjust either the amount or the fee."
              )}
            </InvalidFeedback>
          )}
        </section>

        {withLedger ? (
          <button {...submitAttrs} disabled={disabled}>
            {t('Confirm with ledger')}
          </button>
        ) : (
          <>
            <section className="form-group">
              <label className="label">{t('Confirm with password')}</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={e => handleChange(e.target.value)}
                disabled={isSubmitting}
                placeholder={t('Input your password to confirm')}
                className="form-control"
                autoComplete="off"
              />
              {incorrect && (
                <InvalidFeedback tooltip>{incorrect}</InvalidFeedback>
              )}
            </section>

            <Divider />
            <button {...submitAttrs} disabled={disabled || !password}>
              {isSubmitting ? `${t(label[1])}…` : t(label[0])}
            </button>
          </>
        )}
      </form>
    )
  ) : (
    <Confirm icon="check_circle" title={t('Success!')} actions={actions}>
      {message}
    </Confirm>
  )
}

const Confirmation = (props: Props) => {
  const { address } = useAuth()
  return (
    <WithAuth>
      <WithRequest url={`/v1/bank/${address}`}>
        {(bank: Bank) => <Form {...props} {...bank} />}
      </WithRequest>
    </WithAuth>
  )
}

export default Confirmation

/* coefficient */
const getCoefficient = (name: string): string => {
  const defaultCoefficient = '1.5'
  const coefficients: { [name: string]: string } = {}
  return coefficients[name] || defaultCoefficient
}

/* validations */
type Validate = (params: Params, balance: Balance[]) => boolean
type Compare = (b: Balance) => boolean
type Params = { amount: string; denom?: string; tax?: string; fee: Coin }

const getEmpty = (denom: string) => ({
  denom,
  available: '0',
  delegatable: '0'
})

const validate = (name: string) => {
  const isAvailable: Validate = (params, balance) => {
    const compare: Compare = b =>
      denom === fee.denom
        ? lte(sum([amount, tax, fee.amount]), b.available)
        : lte(plus(amount, tax), b.available) && isFeeAvailable(params, balance)

    const { amount, denom, tax = '0', fee } = params
    const b = denom && (find<Balance>(balance)(denom) || getEmpty(denom))
    return !!b && compare(b)
  }

  const isDelegatable: Validate = (params, balance) => {
    const compare: Compare = b =>
      denom === fee.denom
        ? lte(plus(amount, fee.amount), b.delegatable) &&
          lte(fee.amount, b.available)
        : lte(amount, b.delegatable) && isFeeAvailable(params, balance)

    const { amount, denom, fee } = params
    const b = denom && find<Balance>(balance)(denom)
    return !!b && compare(b)
  }

  const isFeeAvailable: Validate = ({ fee }, balance) => {
    const b = find<Balance>(balance)(fee.denom)
    return !!b && lte(fee.amount, b.available)
  }

  const functions: { [name: string]: Validate } = {
    Send: isAvailable,
    Swap: isAvailable,
    Delegate: isDelegatable,
    Propose: isAvailable,
    Deposit: isAvailable,
    Vote: isFeeAvailable
  }

  return functions[name] || isFeeAvailable
}

const findErrorMessage = (raw_log: string): string => {
  try {
    const parsed = JSON.parse(raw_log)

    if (Array.isArray(parsed)) {
      const { log } = parsed.find(({ success }) => !success)
      const { message } = JSON.parse(log)
      return message
    } else if (typeof parsed === 'object') {
      const { message } = parsed
      return message
    }

    return ''
  } catch (error) {
    return ''
  }
}
