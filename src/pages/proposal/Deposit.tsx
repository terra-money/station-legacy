import React from 'react'
import { percent } from '../../api/math'
import { format } from '../../utils'
import Card from '../../components/Card'
import Orb from '../../components/Orb'
import Amount from '../../components/Amount'
import CoinList from '../../components/CoinList'
import { calcDepositRatio } from '../governance/helpers'
import s from './Deposit.module.scss'

const Deposit = (deposit: Deposit) => {
  const { minDeposit, totalDeposit, depositEndTime } = deposit
  const total = !totalDeposit.length ? String(0) : totalDeposit[0].amount

  return (
    <Card
      title="Deposit"
      mainClassName={s.main}
      bodyClassName={s.body}
      bordered
    >
      <section className={s.content}>
        <Orb ratio={calcDepositRatio(deposit)} size={120} className={s.orb} />
        <strong>{percent(calcDepositRatio(deposit))}</strong>
        <p>
          Total <Amount hideDecimal>{total}</Amount> Luna
        </p>
      </section>

      <footer className={s.footer}>
        <article>
          <h1>Minimum deposit</h1>
          <CoinList list={minDeposit} />
        </article>
        <article>
          <h1>Deposit end time</h1>
          <p>{format.date(depositEndTime)}</p>
        </article>
      </footer>
    </Card>
  )
}

export default Deposit
