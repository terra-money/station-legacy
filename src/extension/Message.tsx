import { useState, Fragment } from 'react'
import classNames from 'classnames/bind'
import { Msg } from '@terra-money/terra.js'
import { readMsg } from '@terra-money/msg-reader'
import Icon from '../components/Icon'
import s from './Message.module.scss'

const cx = classNames.bind(s)

interface Props {
  msg: Msg
  danger?: boolean
  defaultIsOpen?: boolean
  parseTxText: (text?: string) => string
}

const Message = ({ msg, danger, defaultIsOpen, parseTxText }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)
  const toggle = () => setIsOpen(!isOpen)

  /* render */
  const { type } = msg.toData()
  const [, badge] = type.split('/Msg')
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

  return (
    <article className={cx(s.message, { danger })}>
      <header className={s.header} onClick={toggle}>
        <p>{parseTxText(msgText) || badge}</p>
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
