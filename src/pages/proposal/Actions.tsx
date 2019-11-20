import React from 'react'
import { DateTime } from 'luxon'
import { useModal } from '../../hooks'
import Modal from '../../components/Modal'
import ActionBar from '../../components/ActionBar'
import ButtonWithName from '../../components/ButtonWithName'
import WithMaxLuna from '../../components/WithMaxLuna'
import Deposit from './actions/Deposit'
import Vote from './actions/Vote'

interface Props {
  max: string
  disabled: boolean
  detail: ProposalDetail
}

const Component = ({ max, disabled, detail }: Props) => {
  const { id, status, deposit } = detail
  const modal = useModal()

  const buttons = {
    deposit: (
      <ButtonWithName
        placement="bottom"
        className="btn btn-sky btn-sm"
        disabled={disabled}
        onClick={() =>
          modal.open(
            <Deposit
              id={id}
              deposit={deposit}
              max={max}
              onSubmitting={modal.prevent}
              onSubmit={modal.close}
            />
          )
        }
      >
        Deposit
      </ButtonWithName>
    ),
    vote: (
      <ButtonWithName
        placement="bottom"
        className="btn btn-primary btn-sm"
        disabled={disabled}
        onClick={() =>
          modal.open(
            <Vote id={id} onSubmitting={modal.prevent} onSubmit={modal.close} />
          )
        }
      >
        Vote
      </ButtonWithName>
    )
  }

  const isDepositing =
    DateTime.fromISO(deposit.depositEndTime) > DateTime.local()
  const isVoting = status === 'Voting'
  const list = [isDepositing && buttons.deposit, isVoting && buttons.vote]

  return (
    <>
      <ActionBar list={list.filter(Boolean)} />
      <Modal config={modal.config}>{modal.content}</Modal>
    </>
  )
}

const Actions = (props: { detail: ProposalDetail }) => (
  <WithMaxLuna>
    {(max, balance) => (
      <Component max={max} disabled={!balance.length} {...props} />
    )}
  </WithMaxLuna>
)

export default Actions
