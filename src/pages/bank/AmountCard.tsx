import React, { FC, ReactNode, useState } from 'react'
import { DisplayCoin } from '../../lib'
import { TERRA_ASSETS } from '../../lib/pages/constants'
import { isExtension } from '../../utils/env'
import { ReactComponent as Terra } from '../../images/Terra.svg'
import Card from '../../components/Card'
import Number from '../../components/Number'
import s from './AmountCard.module.scss'

interface Props extends DisplayCoin {
  button: ReactNode
  icon?: string
}

const AmountCard: FC<Props> = ({ unit, value, button, children, ...props }) => {
  const [iconError, setIconError] = useState(false)
  const size = { width: 24, height: 24 }

  const src = `${TERRA_ASSETS}/icon/60/${unit}.png`

  const icon = props.icon ? (
    <img src={props.icon} className={s.icon} alt="" {...size} />
  ) : !iconError ? (
    <img src={src} onError={() => setIconError(true)} alt="" {...size} />
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

  return isExtension ? (
    <div className={s.extension}>{content}</div>
  ) : (
    <Card bodyClassName={s.card}>{content}</Card>
  )
}

export default AmountCard
