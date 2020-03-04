import React, { Fragment } from 'react'
import c from 'classnames'
import { useDeposit, useAuth, useInfo } from '@terra-money/use-station'
import { DepositContent } from '@terra-money/use-station'
import { useApp } from '../hooks'
import ModalContent from '../components/ModalContent'
import Confirm from '../components/Confirm'
import ProgressCircle from '../components/ProgressCircle'
import Form from '../components/Form'
import Displays from '../components/Displays'
import Confirmation from './Confirmation'
import s from './Deposit.module.scss'

interface Props {
  params: { id: string; title: string }
  contents: DepositContent[]
}

const Deposit = ({ params, contents }: Props) => {
  const { modal } = useApp()
  const { user } = useAuth()
  const { ERROR } = useInfo()
  const { error, loading, submitted, form, confirm } = useDeposit(user!, params)

  return error ? (
    <Confirm {...ERROR} />
  ) : loading ? (
    <ProgressCircle center />
  ) : !submitted ? (
    <ModalContent close={modal.close}>
      {form && (
        <Form form={form} reversed>
          <dl className={c('dl-wrap', s.dl)}>
            {contents.map(({ title, displays, content }) => (
              <Fragment key={title}>
                <dt>{title}</dt>
                <dd>{displays ? <Displays list={displays} /> : content}</dd>
              </Fragment>
            ))}
          </dl>
        </Form>
      )}
    </ModalContent>
  ) : confirm ? (
    <Confirmation confirm={confirm} modal={modal} />
  ) : null
}

export default Deposit
