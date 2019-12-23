import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { percent } from '../../api/math'
import { format } from '../../utils'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Icon from '../../components/Icon'
import Orb from '../../components/Orb'
import { getBadgeColor, convertVote, calcDepositRatio } from './helpers'
import VoteChart from './VoteChart'
import s from './ProposalCard.module.scss'

const ProposalCard = (proposal: ProposalItem) => {
  const { t } = useTranslation()
  const { id, status, title, proposer, submitTime, deposit, vote } = proposal

  const renderDetail = ([title, content]: ReactNode[]) => (
    <article>
      <h2>{title}</h2>
      <p>{content}</p>
    </article>
  )

  const renderVote = ({ distribution, votingEndTime }: Vote) => {
    const { list, mostVoted } = convertVote(distribution)

    return (
      <section className={s.details}>
        <VoteChart options={list} />
        {mostVoted &&
          renderDetail([
            t('Most voted on'),
            <>
              {mostVoted.label}
              <small>({percent(mostVoted.ratio)})</small>
            </>
          ])}
        {renderDetail([
          t('Ends in'),
          <small>{format.date(votingEndTime)}</small>
        ])}
      </section>
    )
  }

  return (
    <Link to={`/proposal/${id}`} className={s.link}>
      <Card className={s.card} bodyClassName={s.main}>
        <section>
          <Badge className={c('text-capitalize', getBadgeColor(status))}>
            {t(status)}
          </Badge>

          <h1 className={s.title}>{title}</h1>
          <p className={s.meta}>
            {t('Submitted by ')}
            <strong>
              {proposer.moniker ??
                format.truncate(proposer.accountAddress, [5, 5])}
            </strong>{' '}
            at {format.date(submitTime)}
          </p>

          {proposal.status === 'Deposit' ? (
            <section className={s.details}>
              <Orb ratio={calcDepositRatio(deposit)} size={100} />
              {renderDetail([t('Deposit'), percent(calcDepositRatio(deposit))])}
              {renderDetail([
                t('Ends in'),
                <small>{format.date(deposit.depositEndTime)}</small>
              ])}
            </section>
          ) : (
            proposal.status === 'Voting' && vote && renderVote(vote)
          )}
        </section>

        <footer className={s.circle}>
          <Icon name="chevron_right" />
        </footer>
      </Card>
    </Link>
  )
}

export default ProposalCard
