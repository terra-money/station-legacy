import c from 'classnames'
import { TxDescription } from '@terra-money/react-base-components'
import { TxUI, MessageUI, Card as CardProps } from '../../lib'
import { format } from '../../lib'
import Card from '../../components/Card'
import Icon from '../../components/Icon'
import Badge from '../../components/Badge'
import ExtLink from '../../components/ExtLink'
import { useCurrentChainName } from '../../data/chain'
import { useAddress } from '../../auth/auth'
import useLCD from '../../api/useLCD'
import s from './Tx.module.scss'

const Tx = ({ link, hash, date, messages, details, collapsedLength }: TxUI) => {
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

  const address = useAddress()
  const network = useCurrentChainName()
  const lcd = useLCD()
  const config = { name: network, ...lcd.config }

  const renderMessage = (
    { tag, summary, success }: MessageUI,
    index: number
  ) => {
    const badgeClassName = success ? 'badge-secondary' : 'badge-danger'
    return (
      <article className={s.message} key={index}>
        <Badge className={c(s.tag, badgeClassName)} small>
          {tag}
        </Badge>

        <section className={s.text}>
          {summary.map((item, index) => (
            <p key={index}>
              <TxDescription
                network={config}
                config={{ myWallet: address, printCoins: 2 }}
              >
                {item}
              </TxDescription>
            </p>
          ))}
        </section>
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
      {collapsedLength ? (
        <span className={s.collapsed}>{collapsedLength} more</span>
      ) : null}
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
