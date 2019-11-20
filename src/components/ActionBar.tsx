import React, { ReactNode } from 'react'
import s from './ActionBar.module.scss'

const ActionBar = ({ list }: { list: ReactNode[] }) => (
  <section className={s.actions}>
    {list.map((c, i) => (
      <span className={s.action} key={i}>
        {c}
      </span>
    ))}
  </section>
)

export default ActionBar
