import { Proposal } from '@terra-money/terra.js'
import { useMenu } from '../../lib'
import { useGoBack } from '../../hooks'
import { useProposal, useProposalId } from '../../data/lcd/gov'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Page from '../../components/Page'
import ProposalHeader from './ProposalHeader'
import ProposalVotes from './ProposalVotes'
import ProposalDeposits from './ProposalDeposits'
import ProposalActions from './ProposalActions'
import ProposalFooter from './ProposalFooter'
import Depositors from '../../tables/Depositors'

const ProposalDetails = () => {
  useGoBack('/governance')
  const { Proposal: title } = useMenu()

  /* query */
  const id = useProposalId()
  const result = useProposal(id)
  const { error, isLoading: loading, data } = result

  const render = (proposal: Proposal) => {
    const { status } = proposal
    const { DEPOSIT_PERIOD, VOTING_PERIOD } = Proposal.Status

    return (
      <>
        <ProposalHeader proposal={proposal} />

        {status !== DEPOSIT_PERIOD && <ProposalVotes />}

        {(status === VOTING_PERIOD || status === DEPOSIT_PERIOD) && (
          <div className="row">
            <div className="col col-4">
              <ProposalDeposits />
            </div>
            <div className="col col-8">
              <Depositors />
            </div>
          </div>
        )}

        <ProposalFooter />
      </>
    )
  }

  return (
    <Page title={title} action={data && <ProposalActions proposal={data} />}>
      {error ? (
        <ErrorComponent error={error as Error} card />
      ) : loading ? (
        <Loading card />
      ) : (
        data && render(data)
      )}
    </Page>
  )
}

export default ProposalDetails
