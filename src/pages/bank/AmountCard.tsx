import React, { FC, ReactNode } from 'react'
import { Dictionary } from 'ramda'
import { DisplayCoin } from '@terra-money/use-station'
import { ReactComponent as Luna } from '../../images/Luna.svg'
import { ReactComponent as Terra } from '../../images/Terra.svg'
import SDT from '../../images/SDT.png'
import UST from '../../images/UST.png'
import KRT from '../../images/KRT.png'
import MNT from '../../images/MNT.png'
import Card from '../../components/Card'
import Number from '../../components/Number'
import s from './AmountCard.module.scss'

const TerraIcon: Dictionary<string> = { SDT, UST, KRT, MNT }

interface Props extends DisplayCoin {
  button: ReactNode
}

const AmountCard: FC<Props> = ({ unit, value, button, children }) => {
  const size = { width: 24, height: 24 }

  const icon = TerraIcon[unit] ? (
    <img src={TerraIcon[unit]} alt="" {...size} />
  ) : unit === 'Luna' ? (
    <Luna {...size} />
  ) : (
    <Terra {...size} />
  )

  const content = (
    <article className={s.article}>
      <header className={s.header}>
        <h1 className={s.denom}>
          {icon}
          {unit}
        </h1>
        <section className={s.action}>
          <Number className={s.amount}>{value}</Number>
          <div className={s.button}>{button}</div>
        </section>
      </header>

      {children}
    </article>
  )

  return <Card bodyClassName={s.card}>{content}</Card>
}

export default AmountCard
