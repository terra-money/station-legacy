import React from 'react'
import { Link } from 'react-router-dom'
import { ProposalItemUI } from '@terra-money/use-station'
import c from 'classnames'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Orb from '../../components/Orb'
import Flex from '../../components/Flex'
import { getBadgeColor } from './helpers'
import VoteChart from './VoteChart'
import s from './ProposalItem.module.scss'

const ProposalItem = (proposal: ProposalItemUI) => {
  const { id, status, statusTranslation, title, meta, deposit, vote } = proposal

  const renderDetail = (d: { title: string; content: string }, i: number) => (
    <article key={i}>
      <h2>{d.title}</h2>
      <p>{d.content}</p>
    </article>
  )

  const footer = deposit ? (
    <section className={s.details}>
      <Orb ratio={deposit.ratio} completed={deposit.completed} size={100} />
      {deposit.contents.map(renderDetail)}
    </section>
  ) : vote ? (
    <section className={s.details}>
      <div className={s.chart}>
        <VoteChart options={vote.list} />
      </div>

      {vote.contents.map(renderDetail)}
    </section>
  ) : null

  return (
    <Link to={`/proposal/${id}`} className={s.link}>
      <Card className={s.card} bodyClassName={s.main} footer={footer}>
        <Flex className="space-between">
          <Badge className={c('text-capitalize', getBadgeColor(status))}>
            {statusTranslation}
          </Badge>

          <p className={s.id}>
            <strong>ID:</strong> {id}
          </p>
        </Flex>

        <h1 className={s.title}>{title}</h1>
        <p className={s.meta}>{meta}</p>
      </Card>
    </Link>
  )
}

export default ProposalItem
