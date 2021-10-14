import { ReactNode, Fragment, FC } from 'react'
import c from 'classnames'
import { Card } from '../lib'
import { ConfirmLedger as ConfirmLedgerProps } from '../lib'
import Form, { Props as FormProps } from '../components/Form'
import InvalidFeedback from '../components/InvalidFeedback'
import Confirm from '../components/Confirm'
import ConfirmLedger from '../auth/ConfirmLedger'
import PendingTx from './PendingTx'
import s from './ConfirmationComponent.module.scss'

interface Props extends FormProps {
  dl?: { dt: ReactNode; dd: ReactNode }[]
  ledger?: ConfirmLedgerProps
  result?: Card
  warn?: string
  txhash?: string
  pagination?: ReactNode
  onFinish?: () => void
}

const ConfirmationComponent: FC<Props> = ({ dl, ledger, warn, ...props }) => {
  const { result, onFinish, children, pagination, txhash, ...formProps } = props

  const renderResultButton = (label: string) => (
    <button className="btn btn-block btn-primary" onClick={onFinish}>
      {label}
    </button>
  )

  return result ? (
    <Confirm
      {...result}
      icon="check_circle"
      footer={result.button && renderResultButton(result.button)}
    />
  ) : txhash ? (
    <PendingTx txhash={txhash} />
  ) : ledger ? (
    <ConfirmLedger {...ledger} />
  ) : (
    <Form
      {...formProps}
      actions={pagination}
      renderBeforeFields={() => (
        <>
          {children}

          {dl && (
            <dl className={c('dl-wrap', s.dl)}>
              {dl.map(({ dt, dd }, index) => (
                <Fragment key={index}>
                  <dt>{dt}</dt>
                  <dd>{dd}</dd>
                </Fragment>
              ))}
            </dl>
          )}

          <section className={s.feedback}>
            {formProps.form.errors?.map((error, index) => (
              <InvalidFeedback key={index}>{error}</InvalidFeedback>
            ))}

            {warn && <InvalidFeedback warn>{warn}</InvalidFeedback>}
          </section>
        </>
      )}
    />
  )
}

export default ConfirmationComponent
