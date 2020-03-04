import React from 'react'
import { VoteUI, percent } from '@terra-money/use-station'
import Card from '../../components/Card'
import Number from '../../components/Number'
import VoteChart from '../governance/VoteChart'
import VoteProgress from './VoteProgress'
import s from './Votes.module.scss'

const Vote = ({ title, list, total, end, voted, progress }: VoteUI) => (
  <Card title={title} bordered>
    <section className={s.main}>
      <header className={s.header}>
        <VoteChart options={list} />

        <section className={s.summary}>
          <article>
            <h1>{total.title}</h1>
            <Number {...total.display} fontSize={18} />
          </article>
          <article>
            <h1>{end.title}</h1>
            <p>{end.date}</p>
          </article>
        </section>
      </header>

      <section className={s.options}>
        {list.map(({ label, ratio, display, color }) => (
          <div className={s.option} key={label}>
            <article style={{ borderColor: color }}>
              <h1>{label}</h1>
              <p>{percent(ratio)}</p>
              <Number fontSize={14}>{display.value}</Number>
            </article>
          </div>
        ))}
      </section>
    </section>

    {progress && (
      <footer className={s.footer}>
        <VoteProgress {...progress} />
        <p>
          <strong>{voted[0]}</strong>
        </p>
        <small>{voted[1]}</small>
      </footer>
    )}
  </Card>
)

export default Vote
