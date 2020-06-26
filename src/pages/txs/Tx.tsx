import React from 'react'
import c from 'classnames'
import { TxUI, MessageUI, Card as CardProps } from '@terra-money/use-station'
import { format } from '@terra-money/use-station'
import Card from '../../components/Card'
import Icon from '../../components/Icon'
import Badge from '../../components/Badge'
import ExtLink from '../../components/ExtLink'
import s from './Tx.module.scss'

const Tx = ({ link, hash, date, messages, details }: TxUI) => {
  const renderTitle = () => (
    <>
      <ExtLink href={link} className={s.hash}>
        {format.truncate(hash, [18, 18])}
      </ExtLink>

      <section className={s.date}>
        <Icon name="date_range" />
        {date}
      </section>
    </>
  )

  const renderMessage = ({ tag, text, success }: MessageUI, index: number) => {
    const badgeClassName = success ? 'badge-secondary' : 'badge-danger'
    return (
      <article className={s.message} key={index}>
        <Badge className={c(s.tag, badgeClassName)} small>
          {tag}
        </Badge>
        <p className={s.text}>{text}</p>
      </article>
    )
  }

  const renderDetail = ({ title, content }: CardProps) => (
    <li key={title}>
      <strong>{title}</strong>
      <span>{content}</span>
    </li>
  )

  return (
    <Card title={renderTitle()} {...classNames} bgHeader>
      {messages.map(renderMessage)}
      <hr />
      <ul className={s.details}>{details.map(renderDetail)}</ul>
    </Card>
  )
}

export default Tx

/* styles */
const classNames = {
  headerClassName: s.header,
  bodyClassName: s.body,
}
