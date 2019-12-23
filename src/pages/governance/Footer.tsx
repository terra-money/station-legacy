import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Duration } from 'luxon'
import { div, toNumber } from '../../api/math'
import CoinList from '../../components/CoinList'

type Props = Omit<Governance, 'proposals'>

const Footer = ({ votingPeriod, minDeposit, maxDepositPeriod }: Props) => {
  const { t } = useTranslation()

  const stringify = (nanosecond: string) =>
    Duration.fromMillis(toNumber(div(nanosecond, 1e6))).toFormat('d') +
    t(' days')

  const renderContent = ([title, content]: [string, ReactNode]) => (
    <article key={title}>
      <h1>{title}</h1>
      <section>{content}</section>
    </article>
  )

  const contents: [string, ReactNode][] = [
    [t('Voting period'), stringify(votingPeriod)],
    [t('Minimum deposit'), <CoinList list={minDeposit} />],
    [t('Maximum deposit period'), stringify(maxDepositPeriod)]
  ]

  return <>{contents.map(renderContent)}</>
}

export default Footer
