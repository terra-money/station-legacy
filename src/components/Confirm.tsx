import React, { FC } from 'react'
import Icon from './Icon'
import s from './Confirm.module.scss'

type Props = {
  icon?: string
  title: string
  actions?: { onClick: () => void; children: string; className: string }[]
}

const Confirm: FC<Props> = ({ icon, title, children, actions = [] }) => (
  <article className={s.article}>
    <header className={s.header}>
      {icon && <Icon name={icon} size={50} />}
      <h1 className={s.title}>{title}</h1>
    </header>

    <section className={s.main}>{children}</section>

    {!!actions.length && (
      <footer className={s.actions}>
        {actions.map((attrs, index) => (
          <button {...attrs} key={index} />
        ))}
      </footer>
    )}
  </article>
)

export default Confirm
