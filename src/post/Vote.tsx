import React from 'react'
import { useVote, useAuth, useInfo, Field } from '@terra-money/use-station'
import { useApp } from '../hooks'
import ModalContent from '../components/ModalContent'
import Form from '../components/Form'
import Confirm from '../components/Confirm'
import ProgressCircle from '../components/ProgressCircle'
import Confirmation from './Confirmation'
import VoteItem from './VoteItem'
import s from './Vote.module.scss'

const Vote = ({ params }: { params: { id: string; title: string } }) => {
  const { modal } = useApp()
  const { user } = useAuth()
  const { ERROR } = useInfo()
  const { error, loading, submitted, form, confirm } = useVote(user!, params)

  return error ? (
    <Confirm {...ERROR} />
  ) : loading ? (
    <ProgressCircle center />
  ) : !submitted ? (
    <ModalContent close={modal.close}>
      {form && (
        <Form
          form={form}
          className={s.options}
          renderField={(field: Field<{ color: string }>) => (
            <VoteItem {...field} />
          )}
        />
      )}
    </ModalContent>
  ) : confirm ? (
    <Confirmation confirm={confirm} modal={modal} />
  ) : null
}

export default Vote
