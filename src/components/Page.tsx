import { FC, ReactNode } from 'react'
import s from './Page.module.scss'

type Props = { title?: string; desc?: string; action?: ReactNode }

const Page: FC<Props> = ({ title, desc, action, children }) => (
  <article className={s.article}>
    {(title || action) && (
      <header className={s.header}>
        <section className={s.heading}>
          <h1 className={s.title}>{title}</h1>
          {action}
        </section>

        {desc && <p className={s.desc}>{desc}</p>}
      </header>
    )}

    {children}
  </article>
)

export default Page
