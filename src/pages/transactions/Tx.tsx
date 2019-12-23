import React from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { format } from '../../utils'
import Card from '../../components/Card'
import Icon from '../../components/Icon'
import Badge from '../../components/Badge'
import Finder from '../../components/Finder'
import s from './Tx.module.scss'

const Tx = (tx: Tx) => {
  const { timestamp, txhash, txFee, memo, success, msgs, errorMessage } = tx
  const { i18n, t } = useTranslation()

  const renderTitle = () => (
    <>
      <Finder network={tx.chainId} q="tx" v={txhash} className={s.hash}>
        {format.truncate(txhash, [18, 18])}
      </Finder>

      <section className={s.date}>
        <Icon name="date_range" />
        {format.date(timestamp, { toLocale: true })}
      </section>
    </>
  )

  const renderMessage = ({ tag, text }: Message, index: number) => {
    const badgeClassName = success ? 'badge-secondary' : 'badge-danger'
    return (
      <article className={s.message} key={index}>
        {tag && (
          <Badge className={c(s.tag, badgeClassName)} small>
            {i18n.languages?.includes('en') ? tag : t(tag.toLowerCase())}
          </Badge>
        )}
        <p className={s.text}>{text}</p>
      </article>
    )
  }

  const details = [
    [t('Tx fee'), txFee ? txFee.map(format.coin).join(', ') : '0'],
    [t('Memo'), memo],
    [t('Log'), errorMessage]
  ]

  const renderDetail = ([title, content]: string[]) =>
    content && (
      <li key={title}>
        <strong>{title}</strong>
        <span>{content}</span>
      </li>
    )

  return (
    <Card title={renderTitle()} {...classNames} bgHeader>
      {msgs.map(renderMessage)}
      <hr />
      <ul className={s.details}>{details.map(renderDetail)}</ul>
    </Card>
  )
}

export default Tx

/* styles */
const classNames = {
  headerClassName: s.header,
  bodyClassName: s.body
}
