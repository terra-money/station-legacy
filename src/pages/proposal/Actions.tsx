import React from 'react'
import { ProposalUI } from '@terra-money/use-station'
import { useApp } from '../../hooks'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import Deposit from '../../post/Deposit'
import Vote from '../../post/Vote'

const Actions = ({ id, title, deposit, vote }: ProposalUI) => {
  const { modal } = useApp()
  const params = { id, title }

  return vote?.voting ? (
    <ButtonWithAuth
      placement="bottom"
      className="btn btn-primary btn-sm"
      onClick={() => modal.open(<Vote params={params} />)}
    >
      {vote.title}
    </ButtonWithAuth>
  ) : deposit.depositing ? (
    <ButtonWithAuth
      placement="bottom"
      className="btn btn-sky btn-sm"
      onClick={() =>
        modal.open(<Deposit params={params} contents={deposit.contents} />)
      }
    >
      {deposit.title}
    </ButtonWithAuth>
  ) : null
}

export default Actions
