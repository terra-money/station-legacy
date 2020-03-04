import React from 'react'
import { usePropose, useAuth, useInfo } from '@terra-money/use-station'
import { useApp } from '../hooks'
import ModalContent from '../components/ModalContent'
import Form from '../components/Form'
import Confirm from '../components/Confirm'
import ProgressCircle from '../components/ProgressCircle'
import Confirmation from './Confirmation'

const Propose = () => {
  const { modal } = useApp()
  const { user } = useAuth()
  const { ERROR } = useInfo()
  const { error, loading, submitted, form, confirm } = usePropose(user!)

  return error ? (
    <Confirm {...ERROR} />
  ) : loading ? (
    <ProgressCircle center />
  ) : !submitted ? (
    <ModalContent close={modal.close}>
      {form && <Form form={form} />}
    </ModalContent>
  ) : confirm ? (
    <Confirmation confirm={confirm} modal={modal} />
  ) : null
}

export default Propose
