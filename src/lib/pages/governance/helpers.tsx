import { TFunction } from 'i18next'
import { sort, Dictionary } from 'ramda'
import { Deposit, FinderFunction } from '../../types'
import { VoteOptions, Voter, VoterUI } from '../../types'
import { sum, div, lt, gt, format } from '../../utils'

export const optionColors: { [key: string]: string } = {
  Yes: '#6292ec',
  No: '#ce4a6f',
  NoWithVeto: '#f19f4d',
  Abstain: '#a757f4',
}

/** Get ratio of each answer and the most voted answers */
export const convertVote = (
  dist: Dictionary<string>,
  t: TFunction
): VoteOptions => {
  const { Yes, No, NoWithVeto, Abstain } = dist
  const total = sum([Yes, No, NoWithVeto, Abstain])
  const isVoted = gt(total, 0)

  const getRatio = (n: string) => (isVoted ? div(n, total) : String(0))
  const getItem = (key: string) => ({
    label: t('Page:Governance:' + key),
    ratio: getRatio(dist[key]),
    amount: dist[key],
    display: format.display({ amount: dist[key], denom: 'uluna' }),
    color: optionColors[key],
  })

  const list = [
    getItem('Yes'),
    getItem('No'),
    getItem('NoWithVeto'),
    getItem('Abstain'),
  ]

  const sorted = sort(
    (a, b) => (a.amount === b.amount ? 0 : lt(a.amount, b.amount) ? 1 : -1),
    list
  )

  return Object.assign({ list }, isVoted && { mostVoted: sorted[0] })
}

export const calcDepositRatio = ({ minDeposit, totalDeposit }: Deposit) =>
  !totalDeposit.length
    ? String(0)
    : div(totalDeposit[0] ? totalDeposit[0].amount : 0, minDeposit[0].amount)

export const getVoter = (
  { moniker, ...rest }: Voter,
  getLink?: FinderFunction
): VoterUI => {
  const { operatorAddress, accountAddress } = rest

  return moniker
    ? {
        address: operatorAddress,
        moniker: moniker,
      }
    : {
        address: accountAddress,
        link: getLink?.({ q: 'account', v: accountAddress }) ?? '',
      }
}
