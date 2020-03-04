import React from 'react'
import { useAuth, useDelegate, useInfo } from '@terra-money/use-station'
import { useApp } from '../hooks'
import Form from '../components/Form'
import ModalContent from '../components/ModalContent'
import Confirm from '../components/Confirm'
import ProgressCircle from '../components/ProgressCircle'
import Confirmation from './Confirmation'

interface Props {
  to: string
  undelegate: boolean
}

const Delegate = ({ to, undelegate }: Props) => {
  const { user } = useAuth()
  const { modal } = useApp()
  const { ERROR } = useInfo()
  const response = useDelegate(user!, { to, undelegate })
  const { error, loading, submitted, form, confirm } = response

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

export default Delegate
