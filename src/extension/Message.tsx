import { useState, Fragment } from 'react'
import classNames from 'classnames/bind'
import { Msg } from '@terra-money/terra.js'
import { readMsg } from '@terra-money/msg-reader'
import { TxDescription } from '@terra-money/react-base-components'
import Icon from '../components/Icon'
import { useCurrentChainName } from '../data/chain'
import { useAddress } from '../auth/auth'
import useLCD from '../api/useLCD'
import s from './Message.module.scss'

const cx = classNames.bind(s)

interface Props {
  msg: Msg
  danger?: boolean
  defaultIsOpen?: boolean
}

const Message = ({ msg, danger, defaultIsOpen }: Props) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)
  const toggle = () => setIsOpen(!isOpen)

  /* render */
  const { '@type': type } = msg.toData()
  const msgText = readMsg(msg)

  const address = useAddress()
  const network = useCurrentChainName()
  const lcd = useLCD()
  const config = { name: network, ...lcd.config }

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
        <p>
          <TxDescription
            network={config}
            config={{ myWallet: address, printCoins: 2 }}
          >
            {msgText || type}
          </TxDescription>
        </p>
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
