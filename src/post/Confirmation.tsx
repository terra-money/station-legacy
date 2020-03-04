import React, { useEffect, Fragment } from 'react'
import c from 'classnames'
import { ConfirmProps, format } from '@terra-money/use-station'
import { useConfirm, useAuth } from '@terra-money/use-station'
import getSigner from '../cosmos/signer'
import signTx from '../cosmos/api/signTx'
import ModalContent from '../components/ModalContent'
import Form from '../components/Form'
import Select from '../components/Select'
import InvalidFeedback from '../components/InvalidFeedback'
import Confirm from '../components/Confirm'
import ConfirmLedger from '../auth/ConfirmLedger'
import s from './Confirmation.module.scss'

interface Props {
  confirm: ConfirmProps
  modal: Modal
}

const Confirmation = ({ confirm, modal }: Props) => {
  const { user } = useAuth()

  const { contents, fee, form, ledger, result } = useConfirm(confirm, {
    user: user!,
    sign: async ({ tx, base, password }) => {
      const { ledger, name } = user!
      const type = ledger ? 'ledger' : 'local'
      const signer = await getSigner(type, { name, password })
      const signedTx = await signTx(tx, signer, base)
      return signedTx
    }
  })

  /* prevent to close modal */
  useEffect(() => {
    modal.prevent(!!form.submitting)
    // eslint-disable-next-line
  }, [form.submitting])

  /* render */
  const renderName = (label: string) => {
    const [head, tail] = label.split('(')
    return (
      <>
        {head}
        {tail && <small>({tail}</small>}
      </>
    )
  }

  const modalActions = {
    goBack: confirm.cancel,
    close: modal.close,
    disabled: form.submitting
  }

  const resultButtonAttrs = {
    className: 'btn btn-block btn-primary',
    onClick: modal.close
  }

  const renderForm = () => (
    <Form form={form} reversed>
      <dl className={c('dl-wrap', s.dl)}>
        {contents.map(({ name, text, displays }) =>
          text ? (
            <Fragment key={name}>
              <dt>{renderName(name)}</dt>
              <dd>{text}</dd>
            </Fragment>
          ) : (
            displays?.map(({ value, unit }, index) => (
              <Fragment key={index}>
                <dt>{!index && renderName(name)}</dt>
                <dd>
                  <span>{value}</span>
                  <span>{unit}</span>
                </dd>
              </Fragment>
            ))
          )
        )}

        {(fee.status || fee.select.attrs.value) && (
          <>
            <dt>
              <span className="form-control-sm">{fee.label}</span>
              {!fee.status && (
                <Select
                  {...fee.select.attrs}
                  className="form-control form-control-sm"
                  onChange={e => fee.select.setValue(e.target.value)}
                >
                  {fee.select.options.map(option => (
                    <option {...option} key={option.value} />
                  ))}
                </Select>
              )}
            </dt>

            <dd>
              {fee.status ? (
                <span className="form-control-sm">{fee.status}</span>
              ) : (
                fee.select.attrs.value && (
                  <div className="input-group">
                    <input
                      {...fee.input.attrs}
                      className="form-control form-control-sm"
                      onChange={e => fee.input.setValue(e.target.value)}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        {format.denom(fee.select.attrs.value)}
                      </span>
                    </div>
                  </div>
                )
              )}
            </dd>
          </>
        )}
      </dl>

      <section className={s.feedback}>
        {fee.message && (
          <p className="text-right pre-line">
            <small>{fee.message}</small>
          </p>
        )}

        {form.errors?.map((error, index) => (
          <InvalidFeedback key={index}>{error}</InvalidFeedback>
        ))}
      </section>
    </Form>
  )

  return (
    <ModalContent {...modalActions}>
      {result ? (
        <Confirm
          {...result}
          icon="check_circle"
          footer={
            result.button && (
              <button {...resultButtonAttrs}>{result.button}</button>
            )
          }
        />
      ) : ledger ? (
        <ConfirmLedger {...ledger} />
      ) : (
        renderForm()
      )}
    </ModalContent>
  )
}

export default Confirmation
