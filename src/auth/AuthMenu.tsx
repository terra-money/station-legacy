import React from 'react'
import c from 'classnames'
import { AuthMenuKey } from '@terra-money/use-station'
import Icon from '../components/Icon'
import { Item } from './Auth'
import s from './AuthMenu.module.scss'

interface Props {
  list: Item[]
  onSelect: (key: AuthMenuKey) => void
}

const AuthMenu = ({ list, onSelect }: Props) => (
  <div className={s.list}>
    {list.map(({ title, icon, key, disabled }) => {
      const attrs = {
        disabled,
        className: c(s.item),
        onClick: () => onSelect(key),
        children: (
          <>
            <Icon name={icon} size={40} />
            <h1>{title}</h1>
            <Icon name="chevron_right" className={s.chevron} />
          </>
        )
      }

      return disabled ? null : <button {...attrs} key={title} />
    })}
  </div>
)

export default AuthMenu
