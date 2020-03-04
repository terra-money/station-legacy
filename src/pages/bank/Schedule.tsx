import React from 'react'
import c from 'classnames'
import { ScheduleUI } from '@terra-money/use-station'
import Icon from '../../components/Icon'
import Number from '../../components/Number'
import s from './Schedule.module.scss'

const Schedule = ({ display, width, ...schedule }: ScheduleUI) => {
  const { released, releasing, percent, status, duration } = schedule

  return (
    <article className={s.component}>
      <section className={s.status}>
        <section className={s.dot}>
          <div className={s.circle}>
            {released && <Icon name="check" size={13} />}
          </div>
        </section>

        <section className={s.percent}>{percent}</section>
      </section>

      <header className={s.header}>
        <h1>
          <Number {...display} fontSize={20} />
        </h1>

        <p>
          <strong>{status}</strong>
          <br />
          {duration}
        </p>

        <div className={s.track}>
          <div
            className={c(s.progress, releasing && s.active)}
            style={{ width }}
            title={width}
          />
        </div>
      </header>
    </article>
  )
}

export default Schedule
