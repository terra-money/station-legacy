import React from 'react'
import { DepositUI } from '@terra-money/use-station'
import Card from '../../components/Card'
import Orb from '../../components/Orb'
import Displays from '../../components/Displays'
import s from './Deposit.module.scss'

const Deposit = ({ title, contents, ...rest }: DepositUI) => {
  const { ratio, completed, percent, total } = rest

  return (
    <Card title={title} mainClassName={s.main} bodyClassName={s.body} bordered>
      <section className={s.content}>
        <Orb ratio={ratio} completed={completed} size={120} className={s.orb} />
        <strong>{percent}</strong>
        <p>{total}</p>
      </section>

      <footer className={s.footer}>
        {contents.slice(1).map(({ title, content, displays }) => (
          <article key={title}>
            <h1>{title}</h1>
            {content ?? (displays && <Displays list={displays} integer />)}
          </article>
        ))}
      </footer>
    </Card>
  )
}

export default Deposit
