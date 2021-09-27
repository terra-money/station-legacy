import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import c from 'classnames'
import { Proposal } from '@terra-money/terra.js'
import { format } from '../../lib'
import { useProposalStatus, useVotesContents } from '../../data/lcd/gov'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Flex from '../../components/Flex'
import Orb from '../../components/Orb'
import { useDepositsContents } from '../proposal/ProposalDeposits'
import VoteChart from './VoteChart'
import s from './ProposalItem.module.scss'

const renderDetail = (d: { title: string; content: ReactNode }, i: number) => (
  <article key={i}>
    <h2>{d.title}</h2>
    <p>{d.content}</p>
  </article>
)

const Deposit = ({ id }: { id: number }) => {
  const depositContents = useDepositsContents(id)
  if (!depositContents) return null
  const { ratio, contents, completed } = depositContents
  return (
    <>
      <Orb ratio={ratio} completed={completed} size={100} />
      {[contents.ratio, contents.end].map(renderDetail)}
    </>
  )
}

const Votes = ({ id }: { id: number }) => {
  const votesContens = useVotesContents(id)
  if (!votesContens) return null
  const { list, contents } = votesContens
  return (
    <>
      <div className={s.chart}>
        <VoteChart options={list} />
      </div>

      {contents.map(renderDetail)}
    </>
  )
}

const ProposalItem = ({ proposal }: { proposal: Proposal }) => {
  const badge = useProposalStatus(proposal)

  const { id, content, status, submit_time } = proposal
  const title = content?.title || ''

  const footer =
    status === Proposal.Status.DEPOSIT_PERIOD ? (
      <section className={s.details}>
        <Deposit id={id} />
      </section>
    ) : status === Proposal.Status.VOTING_PERIOD ? (
      <section className={s.details}>
        <Votes id={id} />
      </section>
    ) : null

  return (
    <Link to={`/proposal/${id}`} className={s.link}>
      <Card className={s.card} bodyClassName={s.main} footer={footer}>
        <Flex className="space-between">
          {badge && (
            <Badge className={c('text-capitalize', badge.color)}>
              {badge.label}
            </Badge>
          )}

          <p className={s.id}>
            <strong>ID:</strong> {id}
          </p>
        </Flex>

        <h1 className={s.title}>{title}</h1>
        <p className={s.meta}>Submitted at {format.date(submit_time)}</p>
      </Card>
    </Link>
  )
}

export default ProposalItem
