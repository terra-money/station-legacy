import { sort } from 'ramda'
import { sum, div, lt, gt } from '../../api/math'

const BadgeColors: { [key: string]: string } = {
  deposit: 'badge-success',
  voting: 'badge-info',
  passed: 'badge-primary',
  rejected: 'badge-danger'
}

export const getBadgeColor = (status: string) =>
  BadgeColors[status.toLowerCase()]

export const convertVote = (dist: Distribution): VoteOptions => {
  const { Yes, No, NoWithVeto, Abstain } = dist
  const total = sum([Yes, No, NoWithVeto, Abstain])
  const isVoted = gt(total, 0)
  const getRatio = (n: string) => (isVoted ? div(n, total) : String(0))
  const list = [
    { label: 'Yes', ratio: getRatio(Yes), amount: Yes },
    { label: 'No', ratio: getRatio(No), amount: No },
    { label: 'NoWithVeto', ratio: getRatio(NoWithVeto), amount: NoWithVeto },
    { label: 'Abstain', ratio: getRatio(Abstain), amount: Abstain }
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
