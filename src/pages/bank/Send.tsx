import React, { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { OOPS } from '../../helpers/constants'
import { times, div, floor } from '../../api/math'
import useValidate from '../../api/validate'
import getTaxInfo, { calcTax } from '../../api/getTaxInfo'
import { format, getSize } from '../../utils'
import { useForm } from '../../hooks'
import ModalContent from '../../components/ModalContent'
import Amount from '../../components/Amount'
import InvalidFeedback from '../../components/InvalidFeedback'
import Divider from '../../components/Divider'
import Confirmation from '../Confirmation'

type Props = {
  initial: Initial
  max: string
  onSending: (b: boolean) => void
  onSend: () => void
}

type Initial = { denom: string; input?: string; to?: string; memo?: string }
type Values = { denom: string; input: string; to: string; memo: string }

const Send = ({ max, onSending, onSend, ...props }: Props) => {
  const { t } = useTranslation()
  const v = useValidate()

  /* validation */
  const validate = ({ input, to, memo }: Values) => ({
    to: v.address(to),
    input: v.input(input, max),
    memo: !(getSize(memo) <= 256) ? t('Memo is too long') : ''
  })

  /* state: form */
  const initial = { input: '', to: '', memo: '', ...props.initial }
  const form = useForm<Values>({ initial, validate })
  const { values, handleChange, changeValue, touched, error, invalid } = form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false) // tax
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false) // tax
  const [isSending, setIsSending] = useState<boolean>(false) // send
  const { denom, input, to, memo } = values
  const amount = times(input || 0, 1e6)

  /* helpers: form */
  const setToMax = () => changeValue({ input: String(div(floor(max), 1e6)) })

  /* state: tax */
  const [taxInfo, setTaxInfo] = useState<TaxInfo>({ rate: '0', cap: '0' })
  const [hasError, setHasError] = useState<boolean>(false)

  /* submit: tx */
  const submit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      denom !== 'uluna' && setTaxInfo(await getTaxInfo(denom))
      setIsSubmitted(true)
    } catch (error) {
      setHasError(true)
    }

    setIsSubmitting(false)
  }

  /* isSending */
  const handleSending = (b: boolean) => {
    onSending(b)
    setIsSending(b)
  }

  /* render */
  const renderError = (key: string) =>
    touched[key] && <InvalidFeedback tooltip>{error[key]}</InvalidFeedback>

  return (
    <ModalContent
      close={onSend}
      goBack={isSubmitted ? () => setIsSubmitted(false) : undefined}
      disabled={isSending}
    >
      {!isSubmitted ? (
        <form onSubmit={submit}>
          <h1>{t('Send')}</h1>

          {hasError ? (
            <p className="text-center">{OOPS}</p>
          ) : (
            <>
              <section className="form-group">
                <label className="label">{t('Denomination')}</label>
                <input
                  type="text"
                  name="denom"
                  value={format.denom(denom)}
                  onChange={handleChange}
                  className="form-control"
                  readOnly
                />
              </section>

              <section className="form-group">
                <label className="label">{t('Send to')}</label>
                <input
                  type="text"
                  name="to"
                  value={to}
                  onChange={handleChange}
                  placeholder={t("Input receiver's wallet address")}
                  className="form-control"
                  autoComplete="off"
                  autoFocus
                />
                {renderError('to')}
              </section>

              <section className="form-group">
                <header className="flex space-between">
                  <label className="label">{t('Amount')}</label>
                  <p className="label-text">
                    {t('Available')}:
                    <button
                      type="button"
                      onClick={setToMax}
                      className="btn-link"
                    >
                      <Amount>{max}</Amount>
                    </button>
                  </p>
                </header>
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

              <section className="form-group">
                <label className="label">
                  {t('Memo')} ({t('Optional')})
                </label>
                <input
                  type="text"
                  name="memo"
                  value={memo}
                  onChange={handleChange}
                  placeholder={t('Input memo')}
                  className="form-control"
                  autoComplete="off"
                />
                {renderError('memo')}
              </section>

              <Divider />
              <button
                type="submit"
                disabled={invalid || isSubmitting}
                className="btn btn-block btn-primary"
              >
                {t('Next')}
              </button>
            </>
          )}
        </form>
      ) : (
        <Confirmation
          url={`/bank/accounts/${to}/transfers`}
          denom={denom}
          memo={memo}
          tax={calcTax(amount, taxInfo)}
          taxInfo={taxInfo}
          type="send"
          payload={{ coins: [{ amount, denom }] }}
          amount={amount}
          label={['Send', 'Sending']}
          message={`Sent ${input} ${format.denom(denom)} to ${to}`}
          onSubmitting={handleSending}
          onFinish={onSend && (() => onSend())}
        />
      )}
    </ModalContent>
  )
}

export default Send
