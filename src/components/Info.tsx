import React, { FC, ReactNode } from 'react'
import { Card as CardProps } from '@terra-money/use-station'
import Icon from './Icon'
import Card from './Card'
import s from './Info.module.scss'

interface Props extends CardProps {
  icon: string | ReactNode
  card?: boolean
}

const Info: FC<Props> = ({ icon, title, content, children, card }) => {
  const inner = (
    <article className={s.component}>
      {typeof icon === 'string' ? <Icon name={icon} size={54} /> : icon}
      <section className={s.content}>
        {title && <h1>{title}</h1>}
        <p>{content ?? children}</p>
      </section>
    </article>
  )

  return card ? <Card>{inner}</Card> : inner
}

export default Info
