import React from 'react'
import Icon from '../components/Icon'
import s from './AuthMenu.module.scss'

interface Item {
  title: string
  icon: string
  onClick: () => void
  disabled?: boolean
}

const AuthMenu = ({ list }: { list: Item[] }) => (
  <div className={s.list}>
    {list.map(({ title, icon, onClick, disabled }) => {
      const children = (
        <>
          <Icon name={icon} size={40} />
          <h1>{title}</h1>
          <Icon name="chevron_right" className={s.chevron} />
        </>
      )

      const attrs = { className: s.item, onClick, disabled, children }
      return disabled ? null : <button {...attrs} key={title} />
    })}
  </div>
)

export default AuthMenu
