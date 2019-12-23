import React, { useState, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { without } from 'ramda'
import api from '../../api/api'
import { minus, times, gt, gte, percent } from '../../api/math'
import useValidate from '../../api/validate'
import { format, find } from '../../utils'
import { useForm, useModal } from '../../hooks'
import Modal from '../../components/Modal'
import Icon from '../../components/Icon'
import Amount from '../../components/Amount'
import Select from '../../components/Select'
import InvalidFeedback from '../../components/InvalidFeedback'
import Flex from '../../components/Flex'
import Pop from '../../components/Pop'
import WithRequest from '../../components/WithRequest'
import ButtonWithName from '../../components/ButtonWithName'
import Divider from '../../components/Divider'
import SwapModal from './SwapModal'
import { ReactComponent as SwapIcon } from '../../helpers/Swap.svg'
import s from './Swap.module.scss'

type Props = { denoms: string[]; getMax: (denom: string) => string }
export type Values = { from: string; to: string; input: string }
const Swap = ({ denoms, getMax }: Props) => {
  const { t } = useTranslation()
  const v = useValidate()
  const modal = useModal()
  const [, firstActive] = denoms

  /* state */
  const [isCalculating, setIsCalculating] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [output, setOutput] = useState<string>('0')
  const [receive, setReceive] = useState<string>('0')
  const handleError = (error: Error) => {
    setHasError(true)
  }

  /* validation */
  const validate = ({ from, input }: Values) => {
    const max = getMax(from)
    return { input: v.input(input, max) }
  }

  /* form */
  const initial = { from: 'uluna', to: '', input: '' }
  const form = useForm<Values>({ initial, validate })
  const { values, changeValue, handleChange, touched, error, invalid } = form
  const { from, to, input } = values
  const amount = times(input || 0, 1e6)

  /* effect */
  useEffect(() => {
    const fetch = async (): Promise<string[]> => {
      const params = { offer_coin: amount + from, ask_denom: to }
      type Swapped = { result: Coin }
      const swapped = await api.get<Swapped>(`/market/swap`, { params })
      const rateList = await api.get<RateList>(`/v1/market/swaprate/${from}`)
      const r = find<Rate>(rateList.data)(to)
      return [swapped.data.result.amount, r ? r.swaprate : '0']
    }

    const calculate = async () => {
      setIsCalculating(true)

      try {
        const [swapped, rate] = await fetch()
        setReceive(swapped)
        setOutput(times(amount, rate))
      } catch (error) {
        handleError(error)
      }

      setIsCalculating(false)
    }

    const init = () => {
      setReceive('0')
      setOutput('0')
    }

    const fetchMinimum = async () => {
      const { data } = await api.get<RateList>(`/v1/market/swaprate/${to}`)
      const r = find<Rate>(data)(from)
      return r ? r.swaprate : '0'
    }

    const effect = async () => {
      from === to && changeValue({ to: '' })

      try {
        const isEnough = gte(amount, times(await fetchMinimum(), '1.01'))
        !invalid && from !== to && isEnough ? calculate() : init()
      } catch (error) {
        handleError(error)
      }
    }

    from && to && effect()
    // eslint-disable-next-line
  }, [amount, from, to, invalid, firstActive])

  /* submit */
  const submit: Submit = e => {
    e.preventDefault()

    const props = Object.assign(
      { ...values },
      { receive, amount, close: modal.close, onSwapping: modal.prevent }
    )

    modal.open(<SwapModal {...props} />)
  }

  /* render */
  const renderLeft = () => (
    <>
      <Select
        name="from"
        value={from}
        onChange={handleChange}
        className="form-control"
        autoComplete="off"
      >
        {denoms.map(denom => (
          <option value={denom} key={denom}>
            {format.denom(denom)}
          </option>
        ))}
      </Select>

      <section className="form-group">
        <input
          type="text"
          name="input"
          value={input}
          onChange={handleChange}
          placeholder="0"
          className="form-control"
          autoComplete="off"
        />

        {renderError('input')}
      </section>

      {renderTable([
        [t('Current balance'), { amount: getMax(from), denom: from }]
      ])}
    </>
  )

  type Params = {
    min_spread: string
    tobin_tax: string
    illiquid_tobin_tax_list: { denom: string; tax_rate: string }[]
  }

  const spread = (
    <Flex>
      {t('Spread')}
      <WithRequest url="/market/parameters">
        {({ result }: { result: Params }) => {
          const { min_spread, tobin_tax, illiquid_tobin_tax_list } = result
          const min = percent(min_spread, 0)
          const minText = `${t('Luna swap spread')}: ${t('min.')} ${min}`
          const tobin = percent(tobin_tax)
          const tobinText = `Terra ${t('tobin tax')}: ${tobin}`
          const illiquid = illiquid_tobin_tax_list[0]
          const illiquidText = `${t('except for ')}${format.denom(
            illiquid.denom
          )}${t(' set at ')}${percent(illiquid.tax_rate, 0)}`
          const content = [minText, `${tobinText} (${illiquidText})`].join('\n')

          return (
            <Pop type="tooltip" placement="top" width={340} content={content}>
              {({ ref, getAttrs }) => (
                <Icon
                  name="info"
                  forwardRef={ref}
                  {...getAttrs({ className: s.icon })}
                />
              )}
            </Pop>
          )
        }}
      </WithRequest>
    </Flex>
  )

  const renderRight = () => (
    <>
      <Select
        name="to"
        value={to}
        onChange={handleChange}
        className="form-control"
        autoComplete="off"
      >
        <option value="" disabled>
          {t('Select a coin…')}
        </option>

        {without([from], denoms).map(denom => (
          <option value={denom} key={denom}>
            {format.denom(denom)}
          </option>
        ))}
      </Select>

      <input
        type="text"
        name="output"
        value={isCalculating ? '…' : format.amount(output)}
        onChange={handleChange}
        placeholder="0"
        className="form-control"
        autoComplete="off"
        readOnly
      />

      {renderTable([
        [spread, { amount: minus(output, receive), denom: to }],
        [t('Receive'), { amount: receive, denom: to }]
      ])}
    </>
  )

  const renderTable = (rows: [ReactNode, Coin][]) => (
    <table className={s.table}>
      <tbody>
        {rows.map(([th, { amount, denom }], index) => (
          <tr key={index}>
            <th>{th}</th>
            <td className="text-right">
              <Amount>{amount}</Amount> {format.denom(denom)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  /* render */
  const renderError = (key: string) =>
    touched[key] && <InvalidFeedback tooltip>{error[key]}</InvalidFeedback>

  return (
    <>
      <article>
        <p className={s.p}>
          <Icon name="info" />
          {!firstActive || hasError
            ? t('Swapping is not available at the moment')
            : t('Select a coin to swap')}
        </p>

        <form onSubmit={submit} className={s.form}>
          <div className="row">
            <section className="col col-5">{renderLeft()}</section>

            <section className="col col-2">
              <div className={s.arrow}>
                <SwapIcon />
              </div>
            </section>

            <section className="col col-5">{renderRight()}</section>
          </div>

          <Divider />
          <ButtonWithName
            type="submit"
            disabled={invalid || hasError || !gt(receive, '0')}
            className="btn btn-block btn-primary"
          >
            {t('Swap')}
          </ButtonWithName>
        </form>
      </article>

      <Modal config={modal.config}>{modal.content}</Modal>
    </>
  )
}

export default Swap
