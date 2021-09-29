import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { DateTime } from 'luxon'
import { ProposalData, ProposalDetail } from '../../../types'
import { Deposit, Vote, TallyingParameters } from '../../../types'
import { ProposalPage, ProposalUI } from '../../../types'
import { DepositUI, DepositContent } from '../../../types'
import { VoteUI, VoteProgressBar, VoteOption } from '../../../types'
import { TallyingUI } from '../../../types'
import { format, times, div, sum, percent, lt, gt, gte } from '../../../utils'
import { useAddress } from '../../../data/auth'
import useFinder from '../../../hooks/useFinder'
import useFCD from '../../../api/useFCD'
import { calcDepositRatio, convertVote, getVoter } from './helpers'

export default (id: string): ProposalPage => {
  const { t } = useTranslation()
  const getLink = useFinder()

  /* api */
  const address = useAddress()
  const url = `/v1/gov/proposals/${id}`
  const params = { account: address }
  const response = useFCD<ProposalData>({ url, params })

  const render = (proposal: ProposalData): ProposalUI => {
    const { id, submitTime, status, title, proposer, type } = proposal
    const { description, content, vote, deposit, tallyingParameters } = proposal

    return {
      id,
      status,
      statusTranslation: t('Page:Governance:' + status),
      title,
      meta: t('Page:Governance:Submitted by '),
      proposer: getVoter(proposer, getLink),
      description,
      details: [
        { title: `${t('Page:Governance:Proposal')} ID`, content: id },
        { title: t('Common:Type'), content: t('Post:Governance:' + type) },
        ...content.map((c) => ({
          title: capitalize(t('Page:Governance:' + c.key)),
          content: stringify(c),
        })),
        {
          title: t('Page:Governance:Submit time'),
          content: format.date(submitTime),
        },
      ],
      deposit: renderDeposit(deposit),
      vote:
        status !== 'Deposit' && vote ? renderVote(vote, proposal) : undefined,
      tallying:
        status === 'Voting' && tallyingParameters
          ? renderTallying(tallyingParameters)
          : undefined,
    }
  }

  const renderDeposit = (deposit: Deposit): DepositUI => {
    const { totalDeposit, minDeposit, depositEndTime } = deposit
    const defaultCoin = { amount: '0', denom: 'uluna' }

    const contents: DepositContent[] = [
      {
        title: t('Page:Governance:Total'),
        displays: totalDeposit.length
          ? totalDeposit.map((c) => format.display(c))
          : [format.display(defaultCoin)],
      },
      {
        title: t('Page:Governance:Minimum deposit'),
        displays: minDeposit.map((c) => format.display(c)),
      },
      {
        title: t('Page:Governance:Deposit end time'),
        content: format.date(depositEndTime),
      },
    ]

    return {
      title: t('Page:Governance:Deposit'),
      ratio: calcDepositRatio(deposit),
      completed: gte(calcDepositRatio(deposit), 1)
        ? t('Page:Governance:Min deposit completed')
        : undefined,
      percent: percent(calcDepositRatio(deposit)),
      total: [
        contents[0]['title'],
        format.coin(totalDeposit[0] ?? defaultCoin, undefined, {
          integer: true,
        }),
      ].join(' '),
      contents,
      depositing: DateTime.fromISO(deposit.depositEndTime) > DateTime.local(),
    }
  }

  const renderVote = (vote: Vote, proposal: ProposalData): VoteUI => {
    const { count, distribution, total, votingEndTime, stakedLuna } = vote
    const { status, tallyingParameters, validatorsNotVoted } = proposal

    const list = convertVote(distribution, t).list
    const ratio = div(total, stakedLuna)
    const voting = status === 'Voting'

    return {
      title: t('Page:Governance:Vote'),
      list,
      ratio,
      count,
      total: {
        title: t('Page:Governance:Total'),
        display: format.display({ amount: total, denom: 'uluna' }),
      },
      end: {
        title: t('Page:Governance:Voting end time'),
        date: format.date(votingEndTime),
      },
      voted: [
        `${t('Page:Governance:Percent voting')}: ${percent(ratio)}`,
        t('Page:Governance:{{n}} of {{d}} has voted', {
          n: format0a(total),
          d: format0a(stakedLuna),
        }),
      ],
      voting,
      progress:
        voting && tallyingParameters
          ? renderProgress({ list, ratio, params: tallyingParameters })
          : undefined,
      notVoted: validatorsNotVoted?.length
        ? {
            title: t(
              "Page:Governance:The following validators you've delegated to have not yet voted on this proposal"
            ),
            list: validatorsNotVoted.map(
              ({ operatorAddress, description: { moniker } }) => ({
                operatorAddress,
                moniker,
              })
            ),
            button: t('Page:Governance:Request to vote'),
          }
        : undefined,
    }
  }

  const renderProgress = ({
    list,
    ratio,
    params: { threshold, quorum },
  }: {
    list: VoteOption[]
    ratio: string
    params: TallyingParameters
  }): VoteProgressBar => {
    const getRatio = ({ ratio }: VoteOption) => ratio
    const d = sum(list.slice(0, 3).map(getRatio))
    const showQuorum = quorum && lt(ratio, quorum)
    const showThreshold = gt(d, 0) && !!threshold
    const showFlag = showQuorum || showThreshold

    const left = showQuorum
      ? percent(quorum!)
      : percent(times(times(ratio, d), threshold!))

    const text = showQuorum
      ? t('Page:Governance:Quorum')
      : t('Page:Governance:Pass threshold')

    return {
      flag: showFlag ? { percent: left, text } : undefined,
      list: list.map((item) => ({
        percent: percent(times(ratio, item.ratio)),
        color: item.color,
      })),
    }
  }

  const renderTallying = (params: TallyingParameters): TallyingUI => {
    const { quorum, threshold, veto } = params

    return {
      title: t('Page:Governance:Tallying procedure'),
      contents: [
        {
          title: t('Page:Governance:Quorum'),
          content: percent(quorum),
        },
        {
          title: t('Page:Governance:Pass threshold'),
          content: percent(threshold),
        },
        {
          title: t('Page:Governance:Veto threshold'),
          content: percent(veto),
        },
      ],
    }
  }

  return Object.assign(
    {},
    response,
    response.data && { ui: render(response.data) }
  )
}

/* helpers */
const stringify = ({ key, value }: ProposalDetail): string =>
  typeof value !== 'string'
    ? JSON.stringify(value, null, 2)
    : key === 'tax_rate' || key === 'reward_weight'
    ? percent(value)
    : value

const format0a = (s: string) =>
  numeral(format.amountN(s)).format('0a').toUpperCase()

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
