import React, { FC, ReactNode } from 'react'
import { DisplayCoin } from '@terra-money/use-station'
import Card from '../../components/Card'
import Number from '../../components/Number'
import s from './AmountCard.module.scss'

interface Props extends DisplayCoin {
  button: ReactNode
}

const AmountCard: FC<Props> = ({ unit, value, button, children }) => (
  <Card bodyClassName={s.card}>
    <article className={s.article}>
      <header className={s.header}>
        <h1 className={s.denom}>{unit}</h1>
        <section className={s.action}>
          <Number className={s.amount}>{value}</Number>
          <div className={s.button}>{button}</div>
        </section>
      </header>

      {children}
    </article>
  </Card>
)

export default AmountCard
