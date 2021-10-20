import { useState, Fragment, ReactNode } from 'react'
import classNames from 'classnames/bind'
import { Msg, MsgTransfer } from '@terra-money/terra.js'
import { readMsg } from '@terra-money/msg-reader'
import { format } from '../utils'
import Icon from '../components/Icon'
import s from './Message.module.scss'

const cx = classNames.bind(s)

interface Props {
  msg: Msg
  danger?: boolean
  defaultIsOpen?: boolean
  parseTxText: (text?: string) => ReactNode
}

const Message = ({ msg, danger, defaultIsOpen, parseTxText }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)
  const toggle = () => setIsOpen(!isOpen)

  /* render */
  const { '@type': type } = msg.toData()
  const msgText = readMsg(msg)

  const renderDl = () => (
    <dl className={s.dl}>
      <dt>type</dt>
      <dd>
        <pre>{type}</pre>
      </dd>

      {getDl(msg).map(({ dt, dd }, index) => (
        <Fragment key={index}>
          <dt>{dt}</dt>
          <dd>
            <pre>{dd}</pre>
          </dd>
        </Fragment>
      ))}
    </dl>
  )

  const parseIbcMessage = ({ token, source_channel }: MsgTransfer) => {
    if (!token) return `Transfer via ${source_channel}`

    const { amount, denom } = token
    const value = format.amount(amount.toString())

    return `Transfer ${value}${denom} via ${source_channel}`
  }

  const parsedIbcMessage =
    type === '/ibc.applications.transfer.v1.MsgTransfer'
      ? parseIbcMessage(msg as MsgTransfer)
      : undefined

  return (
    <article className={cx(s.message, { danger })}>
      <header className={s.header} onClick={toggle}>
        <p>{parsedIbcMessage ?? (parseTxText(msgText) || type)}</p>
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} size={14} />
      </header>

      {isOpen && renderDl()}
    </article>
  )
}

export default Message

/* helpers */
const getDl = (msg: Msg) =>
  Object.entries(msg).map(([k, v]) => ({
    dt: k,
    dd: typeof v === 'object' ? JSON.stringify(v, null, 2) : v,
  }))
