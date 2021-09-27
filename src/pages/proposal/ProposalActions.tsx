import { useTranslation } from 'react-i18next'
import { Proposal } from '@terra-money/terra.js'
import { useApp } from '../../hooks'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import Deposit from '../../post/Deposit'
import Vote from '../../post/Vote'

const ProposalActions = ({ proposal }: { proposal: Proposal }) => {
  const { t } = useTranslation()
  const { modal } = useApp()
  const { id, content, status } = proposal
  const { title } = content
  const params = { id, title }

  return status === Proposal.Status.VOTING_PERIOD ? (
    <ButtonWithAuth
      placement="bottom"
      className="btn btn-primary btn-sm"
      onClick={() => modal.open(<Vote params={params} />)}
    >
      {t('Page:Governance:Vote')}
    </ButtonWithAuth>
  ) : status === Proposal.Status.DEPOSIT_PERIOD ? (
    <ButtonWithAuth
      placement="bottom"
      className="btn btn-sky btn-sm"
      onClick={() => modal.open(<Deposit params={params} />)}
    >
      {t('Page:Governance:Deposit')}
    </ButtonWithAuth>
  ) : null
}

export default ProposalActions
