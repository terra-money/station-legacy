import React from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { percent } from '../../api/math'
import { format } from '../../utils'
import Amount from '../../components/Amount'
import Icon from '../../components/Icon'
import s from './Schedule.module.scss'

const Schedule = ({ denom, ...schedule }: Schedule & { denom: string }) => {
  const { amount, startTime, endTime, ratio, freedRate } = schedule

  const { t } = useTranslation()

  const width = percent(freedRate)
  const now = new Date().getTime()
  const status = endTime < now ? -1 : startTime < now ? 0 : 1
  const text: { [key: string]: string } = {
    '-1': t('Released'),
    '0': t('Releasing'),
    '1': t('Release on')
  }

  return (
    <article className={s.component}>
      <section className={s.status}>
        <section className={s.dot}>
          <div className={s.circle}>
            {status === -1 && <Icon name="check" size={13} />}
          </div>
        </section>

        <section className={s.percent}>{percent(ratio)}</section>
      </section>

      <header className={s.header}>
        <h1>
          <Amount denom={denom} fontSize={20}>
            {amount}
          </Amount>
        </h1>

        <p>
          <strong>{text[String(status)]}</strong>
          <br />
          {[startTime, endTime].map(t => `${toISO(t)}`).join('\n ~ ')}
        </p>

        <div className={s.track}>
          <div
            className={c(s.progress, status === 0 && s.active)}
            style={{ width }}
            title={width}
          />
        </div>
      </header>
    </article>
  )
}

export default Schedule

/* helpers */
const toISO = (date: number) => format.date(new Date(date).toISOString())
