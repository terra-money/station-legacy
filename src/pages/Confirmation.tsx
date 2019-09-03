import React, { useState, useEffect, FormEvent, Fragment } from 'react'
import { OOPS } from '../helpers/constants'
import electron from '../helpers/electron'
import api from '../api/api'
import { GAS_PRICE, calcFee, calcGas } from '../api/calcFee'
import getBaseRequest from '../api/getBaseRequest'
import { plus, sum, times, div, gt, lte, lt } from '../api/math'
import { getKey } from '../utils/localStorage'
import { format, find, report, sanitize } from '../utils'
import { parseError } from '../utils/error'
import { useAuth } from '../hooks'
import WithRequest from '../components/WithRequest'
import InvalidFeedback from '../components/InvalidFeedback'
import Select from '../components/Select'
import Confirm from '../components/Confirm'
import WithAuth from '../components/WithAuth'
import Divider from '../components/Divider'
import s from './Confirmation.module.scss'

type Props = {
  /* values: tx */
  url: string
  denom?: string
  memo?: string
  tax?: string
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
  /* context */
  const auth = useAuth()
  const { name, address: from } = auth

  /* props */
  const { url, denom, memo, tax = '0', type, payload = {} } = props
  const { amount = '0', amounts, receive, warning } = props
  const { label = ['Submit', 'Submitting'] } = props
  const { message, onSubmitting, onFinish } = props
  const { balance } = props

  /* state: component */
  const [errorMessage, setErrorMessage] = useState<string>('')
  const handleError = (error: any) => {
    report(error)

    const { message = OOPS } = error.response
      ? parseError(error.response.data)
      : {}

    setErrorMessage(message)
  }

  /* state: form */
  const [password, setPassword] = useState<string>('')
  const [incorrect, setIncorrect] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const handleChange = (password: string) => {
    setIncorrect('')
    setPassword(password)
  }

  /* state: simulate */
  const [estimatedFeeAmount, setEstimatedFeeAmount] = useState<string>('0')
  const [input, setInput] = useState<string>('0')
  const [feeDenom, setFeeDenom] = useState<string>(denom || balance[0].denom)
  const feeAmount = times(input || 0, 1e6)
  const fee = { amount: feeAmount, denom: feeDenom }
  const gas = calcGas(fee.amount)

  /* effect: simulate */
  const [isSimulating, setIsSimulating] = useState<boolean>(true)

  useEffect(() => {
    const simulate = async () => {
      try {
        const base = await getBaseRequest(from)
        const body = {
          base_req: { ...base, memo, simulate: true },
          ...payload
        }

        const { data } = await api.post(url, body)
        const { gas_estimate } = data
        const estimatedFeeAmount = calcFee(times(gas_estimate, 1.2))
        setEstimatedFeeAmount(estimatedFeeAmount)
        setInput(format.decimal(div(estimatedFeeAmount, 1e6)))
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
        const wallet = getKey(name, password)
        const params = { wallet, tx, request: { ...base, type } }
        await api.post('/txs', electron('signTx', params), config)
        setIsSubmitted(true)
      } catch (error) {
        error.message === 'Incorrect password'
          ? setIncorrect('Incorrect password')
          : handleError(error)
      }
    }

    e.preventDefault()
    setIsSubmitting(true)
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
  const disabled =
    !password || isSimulating || isSubmitting || invalid || !hasFee

  /* render */
  const formatAmount = ({ amount, denom }: Coin) => (
    <>
      <span>{format.amount(amount)}</span> <span>{format.denom(denom)}</span>
    </>
  )

  const actions = onFinish && [
    {
      onClick: onFinish,
      children: 'Ok',
      className: 'btn btn-block btn-primary'
    }
  ]

  return errorMessage ? (
    <Confirm icon="error_outline" title="Fail" actions={actions}>
      {errorMessage}
    </Confirm>
  ) : isSimulating ? (
    <p>(Simulating...)</p>
  ) : !isSubmitted ? (
    <form onSubmit={submit}>
      <h1>Confirm</h1>
      <dl className={s.dl}>
        {amounts
          ? amounts.map((a, i) => (
              <Fragment key={i}>
                <dt>{!i && 'Amount'}</dt>
                <dd>{formatAmount(a)}</dd>
              </Fragment>
            ))
          : denom && (
              <>
                <dt>Amount</dt>
                <dd>{formatAmount({ amount, denom })}</dd>
              </>
            )}

        {gt(tax, 0) && denom && (
          <>
            <dt>Tax (0.1%, Max 1 Luna)</dt>
            <dd>{formatAmount({ amount: tax, denom })}</dd>
          </>
        )}

        <dt>
          Fees
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
            <dt>Memo</dt>
            <dd>{memo}</dd>
          </>
        )}

        {receive && (
          <>
            <dt>Receive</dt>
            <dd>{formatAmount(receive)}</dd>
          </>
        )}
      </dl>

      <section className={s.feedback}>
        {lt(fee.amount, estimatedFeeAmount) && (
          <p className="text-right">
            <small>
              Recommended fee is{' '}
              {format.coin({ amount: estimatedFeeAmount, denom: fee.denom })} or
              higher.
              <br />
              Transactions with low fee might fail to proceed.
            </small>
          </p>
        )}
        {warning && <InvalidFeedback>{warning}</InvalidFeedback>}
        {invalid && (
          <InvalidFeedback>
            You don't have enough balance. Please adjust either the amount or
            the fee.
          </InvalidFeedback>
        )}
      </section>

      <section className="form-group">
        <label className="label">Confirm with password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={e => handleChange(e.target.value)}
          disabled={isSubmitting}
          placeholder="Input your password to confirm"
          className="form-control"
          autoComplete="off"
        />
        {incorrect && <InvalidFeedback tooltip>{incorrect}</InvalidFeedback>}
      </section>

      <Divider />
      <button
        type="submit"
        disabled={disabled}
        className="btn btn-block btn-primary"
      >
        {isSubmitting ? `${label[1]}…` : label[0]}
      </button>
    </form>
  ) : (
    <Confirm icon="check_circle" title="Success!" actions={actions}>
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

/* validations */
type Validate = (params: Params, balance: Balance[]) => boolean
type Compare = (b: Balance) => boolean
type Params = { amount: string; denom?: string; tax?: string; fee: Coin }
const isAvailable: Validate = (params, balance) => {
  const compare: Compare = b =>
    denom === fee.denom
      ? lte(sum([amount, tax, fee.amount]), b.available)
      : lte(plus(amount, tax), b.available) && isFeeAvailable(params, balance)

  const { amount, denom, tax = '0', fee } = params
  const b = denom && find<Balance>(balance)(denom)
  return !!b && compare(b)
}

const isDelegatable: Validate = (params, balance) => {
  const compare: Compare = b =>
    denom === fee.denom
      ? lte(plus(amount, fee.amount), b.delegatable)
      : lte(amount, b.delegatable) && isFeeAvailable(params, balance)

  const { amount, denom, fee } = params
  const b = denom && find<Balance>(balance)(denom)
  return !!b && compare(b)
}

const isFeeAvailable: Validate = ({ fee }, balance) => {
  const b = find<Balance>(balance)(fee.denom)
  return !!b && lte(fee.amount, b.available)
}

const validate = (name: string) => {
  const functions: { [name: string]: Validate } = {
    Send: isAvailable,
    Swap: isAvailable,
    Delegate: isDelegatable
  }

  return functions[name] || isFeeAvailable
}
