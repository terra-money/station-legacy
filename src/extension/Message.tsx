import { useState, Fragment } from 'react'
import { Msg } from '@terra-money/terra.js'
import { readMsg } from '@terra-money/msg-reader'
import Icon from '../components/Icon'
import { getDl } from './Confirm'
import s from './Message.module.scss'

interface Props {
  msg: Msg
  defaultIsOpen?: boolean
  parseTxText: (text?: string) => string
}

const Message = ({ msg, defaultIsOpen, parseTxText }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)
  const toggle = () => setIsOpen(!isOpen)

  /* render */
  const { type } = msg.toData()
  const [, badge] = type.split('/Msg')
  const msgText = readMsg(msg)

  const renderDl = () => (
    <dl className={s.dl}>
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
    <article className={s.message}>
      <header className={s.header} onClick={toggle}>
        <div className={s.detail}>
          <span className={s.type}>{badge}</span>
          <p>{parseTxText(msgText)}</p>
        </div>
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} size={14} />
      </header>

      {isOpen && renderDl()}
    </article>
  )
}

export default Message
