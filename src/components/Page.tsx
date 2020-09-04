import React, { FC, ReactNode } from 'react'
import s from './Page.module.scss'

type Props = { title?: string; action?: ReactNode }

const Page: FC<Props> = ({ title, action, children }) => (
  <article className={s.article}>
    {(title || action) && (
      <header className={s.header}>
        <h1 className={s.title}>{title}</h1>
        {action}
      </header>
    )}

    {children}
  </article>
)

export default Page
