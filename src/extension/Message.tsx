import React, { useState, Fragment } from 'react'
import { Msg } from '@terra-money/terra.js'
import Icon from '../components/Icon'
import { getDl } from './Confirm'
import s from './Message.module.scss'

interface Props {
  msg: Msg
  defaultIsOpen?: boolean
}

const Message = ({ msg, defaultIsOpen }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)
  const toggle = () => setIsOpen(!isOpen)

  /* render */
  const { type } = msg.toData()
  const [, badge] = type.split('/Msg')

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
        <strong className={s.badge}>{badge}</strong>
        <span className={s.button}>
          {isOpen ? 'Collapse' : 'Expand'}
          <Icon name={isOpen ? 'expand_less' : 'expand_more'} size={14} />
        </span>
      </header>

      {isOpen && renderDl()}
    </article>
  )
}

export default Message
