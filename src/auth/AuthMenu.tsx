import React, { ReactNode } from 'react'
import c from 'classnames'
import { Card } from '@terra-money/use-station'
import { isExtension } from '../utils/env'
import { useRemovePadding } from '../hooks'
import Icon from '../components/Icon'
import s from './AuthMenu.module.scss'

interface Item {
  title: string
  icon: string
  onClick: () => void
  disabled?: boolean
}

interface Props {
  card?: Card
  list: Item[]
  footer?: ReactNode
}

const AuthMenu = ({ card, list, footer }: Props) => {
  useRemovePadding()

  return (
    <article className={c(isExtension && s.extension)}>
      {card && (
        <header className={s.header}>
          <h1>{card.title}</h1>
          <p>{card.content}</p>
        </header>
      )}

      <div className={s.list}>
        {list.map(({ title, icon, onClick, disabled }) => {
          const children = (
            <>
              <Icon name={icon} size={isExtension ? 30 : 40} />
              <h1>{title}</h1>
              {!isExtension && (
                <Icon name="chevron_right" className={s.chevron} />
              )}
            </>
          )

          const attrs = { className: s.item, onClick, disabled, children }
          return disabled ? null : <button {...attrs} key={title} />
        })}
      </div>
      {footer}
    </article>
  )
}

export default AuthMenu
