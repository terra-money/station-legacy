import React, { ReactNode } from 'react'
import Card from '../../components/Card'
import Amount from '../../components/Amount'
import s from './AmountCard.module.scss'

type Props = {
  denom: string
  amount: string
  button: ReactNode
  children?: ReactNode
}

const AmountCard = ({ denom, amount, button, children }: Props) => (
  <Card bodyClassName={s.card}>
    <article className={s.article}>
      <header className={s.header}>
        <h1 className={s.denom}>{denom}</h1>
        <section className={s.action}>
          <Amount className={s.amount}>{amount}</Amount>
          <div className={s.button}>{button}</div>
        </section>
      </header>

      {children}
    </article>
  </Card>
)

export default AmountCard
