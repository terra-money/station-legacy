import React, { ReactNode } from 'react'
import { Duration } from 'luxon'
import { div, toNumber } from '../../api/math'
import CoinList from '../../components/CoinList'

type Props = Omit<Governance, 'proposals'>

const Footer = ({ votingPeriod, minDeposit, maxDepositPeriod }: Props) => {
  const renderContent = ([title, content]: [string, ReactNode]) => (
    <article key={title}>
      <h1>{title}</h1>
      <section>{content}</section>
    </article>
  )

  const contents: [string, ReactNode][] = [
    ['Voting Period', stringify(votingPeriod)],
    ['Minimum Deposit', <CoinList list={minDeposit} />],
    ['Maximum Deposit Period', stringify(maxDepositPeriod)]
  ]

  return <>{contents.map(renderContent)}</>
}

export default Footer

/* helper */
const stringify = (nanosecond: string) =>
  Duration.fromMillis(toNumber(div(nanosecond, 1e6))).toFormat('d') + ' days'
