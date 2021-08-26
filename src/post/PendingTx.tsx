import { useEffect, useMemo, useState } from 'react'
import { intervalToDuration } from 'date-fns'
import classNames from 'classnames'
import useFinder from '../lib/hooks/useFinder'
import { truncate } from '../lib/utils/format'
import { ExtLinkWithIcon } from '../components/ExtLink'
import Icon from '../components/Icon'
import Broadcasting from './Broadcasting.gif'
import styles from './PendingTx.module.scss'

const PendingTx = ({ txhash }: { txhash: string }) => {
  const start = useMemo(() => new Date(), [])
  const [now, setNow] = useState(new Date())
  const getLink = useFinder()
  const link = getLink?.({ q: 'tx', v: txhash })

  useEffect(() => {
    setInterval(() => setNow(new Date()), 1000)
  }, [])

  const { minutes, seconds } = intervalToDuration({ start, end: now })

  const fromNow = [minutes, seconds]
    .map((str) => String(str).padStart(2, '0'))
    .join(':')

  return (
    <article className={styles.component}>
      <header className={styles.header}>
        <img src={Broadcasting} alt="" width={100} height={100} />
        <h1 className={styles.title}>Broadcasting transaction</h1>
        <small className={styles.timestamp}>{fromNow}</small>
      </header>

      <div className={styles.card}>
        <section className={styles.processing}>
          <div className={styles.item}>
            <h2>Queued</h2>
          </div>

          <div className={classNames(styles.item, styles.icons)}>
            <Icon name="chevron_right" className={styles.icon} />
            <Icon name="chevron_right" className={styles.icon} />
            <Icon name="chevron_right" className={styles.icon} />
          </div>

          <div className={classNames(styles.item, styles.muted)}>
            <h2>Processed</h2>
          </div>
        </section>

        <p className={styles.desc}>
          The transaction has been successfully queued and will be processed
          shortly.
        </p>

        <footer className={styles.footer}>
          <strong>Tx Hash</strong>
          <ExtLinkWithIcon href={link}>
            {truncate(txhash, [6, 6])}
          </ExtLinkWithIcon>
        </footer>
      </div>
    </article>
  )
}

export default PendingTx
