import React from 'react'
import { Link } from 'react-router-dom'
import s from './PaginationButtons.module.scss'

type Props = {
  links?: { [key: string]: { pathname: string; search: string } }
  actions?: { [key: string]: () => void }
}

const PaginationButtons = ({ links, actions }: Props) => {
  const renderAction = (key: string, children: string, disabled: boolean) =>
    disabled ? (
      <span className={s[key]}>{children}</span>
    ) : links ? (
      <Link to={links[key]} className={s[key]}>
        {children}
      </Link>
    ) : (
      <button onClick={actions && actions[key]} className={s[key]}>
        {children}
      </button>
    )

  return (
    <div className={s.wrapper}>
      <div className={s.component}>{renderAction('next', '›', false)}</div>
    </div>
  )
}

export default PaginationButtons
