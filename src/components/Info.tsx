import React, { FC, ReactNode } from 'react'
import Icon from './Icon'
import s from './Info.module.scss'

type Props = { icon: string | ReactNode; title: string }

const Info: FC<Props> = ({ icon, title, children }) => (
  <article className={s.component}>
    {typeof icon === 'string' ? <Icon name={icon} size={54} /> : icon}
    <section className={s.content}>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  </article>
)

export default Info
