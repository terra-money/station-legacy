import { useTranslation } from 'react-i18next'
import { Duration } from 'luxon'
import { GovernancePage, GovernanceUI, GovernanceParamUI } from '../../types'
import { ProposalsData, ProposalItemData, ProposalItemUI } from '../../types'
import { ProposalStatus, Vote } from '../../types'
import { format, div, percent, toNumber, gte } from '../../utils'
import useFCD from '../../api/useFCD'
import { calcDepositRatio, convertVote } from './helpers'

/** tabs */
export const useProposalStatus = (): {
  key: ProposalStatus
  label: string
}[] => {
  const { t } = useTranslation()

  return [
    { key: 'Voting', label: t('Page:Governance:Voting') },
    { key: 'Deposit', label: t('Page:Governance:Deposit') },
    { key: 'Passed', label: t('Page:Governance:Passed') },
    { key: 'Rejected', label: t('Page:Governance:Rejected') },
  ]
}

export default ({ status }: { status: string }): GovernancePage => {
  const { t } = useTranslation()

  /* api */
  const url = '/v1/gov/proposals'
  const params = { status }
  const response = useFCD<ProposalsData>({ url, params })

  /* render */
  const renderProposal = (proposal: ProposalItemData): ProposalItemUI => {
    const { id, status, title, proposer, submitTime, deposit, vote } = proposal
    return Object.assign(
      {
        id,
        status,
        statusTranslation: t('Page:Governance:' + status),
        title,
        meta: t('Page:Governance:Submitted by {{proposer}} at {{date}}', {
          proposer:
            proposer.moniker ??
            format.truncate(proposer.accountAddress, [5, 5]),
          date: format.date(submitTime),
        }),
      },
      status === 'Deposit' && {
        deposit: {
          ratio: calcDepositRatio(deposit),
          completed: gte(calcDepositRatio(deposit), 1)
            ? t('Page:Governance:Min deposit completed')
            : undefined,
          contents: [
            {
              title: t('Page:Governance:Deposit'),
              content: percent(calcDepositRatio(deposit)),
            },
            {
              title: t('Page:Governance:Ends in'),
              content: format.date(deposit.depositEndTime),
            },
          ],
        },
      },
      proposal.status === 'Voting' && {
        vote: vote && renderVote(vote),
      }
    )
  }

  const renderVote = ({ distribution, votingEndTime }: Vote) => {
    const { list, mostVoted } = convertVote(distribution, t)
    return {
      list,
      contents: ([] as { title: string; content: string }[])
        .concat(
          mostVoted
            ? {
                title: t('Page:Governance:Most voted on'),
                content: `${mostVoted.label} (${percent(mostVoted.ratio)})`,
              }
            : []
        )
        .concat({
          title: t('Page:Governance:Ends in'),
          content: format.date(votingEndTime),
        }),
    }
  }

  const render = ({ proposals, ...rest }: ProposalsData): GovernanceUI => {
    const { votingPeriod, minDeposit, maxDepositPeriod } = rest

    const params: GovernanceParamUI[] = [
      {
        title: t('Page:Governance:Voting period'),
        content: t('Page:Chart:{{d}} days', { d: formatNS(votingPeriod) }),
      },
      {
        title: t('Page:Governance:Minimum deposit'),
        displays: minDeposit.map((coin) => format.display(coin)),
      },
      {
        title: t('Page:Governance:Maximum deposit period'),
        content: t('Page:Chart:{{d}} days', { d: formatNS(maxDepositPeriod) }),
      },
    ]

    return Object.assign(
      { params },
      !proposals.length
        ? { message: t('Page:Governance:No proposals here yet. Be the first!') }
        : { list: proposals.map(renderProposal) }
    )
  }

  return Object.assign(
    { propose: { attrs: { children: t('Page:Governance:New proposal') } } },
    response,
    response.data && { ui: render(response.data) }
  )
}

/* helpers */
const formatNS = (nanosecond: string) =>
  Duration.fromMillis(toNumber(div(nanosecond, 1e6))).toFormat('d')
