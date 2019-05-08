import React from 'react'
import c from 'classnames'
import { loadKeys } from '../../utils/localStorage'
import Icon from '../../components/Icon'
import Badge from '../../components/Badge'
import { Item } from './Auth'
import s from './Menu.module.scss'

type Props = { list: Item[]; onSelect: (index: number) => void }

const Menu = ({ list, onSelect }: Props) => (
  <div className={s.list}>
    {list.map(({ title, icon, isNotReady, disabled }, index) => (
      <button
        onClick={() => onSelect(index)}
        disabled={(disabled && disabled(loadKeys().length)) || isNotReady}
        className={c(s.item, isNotReady && 'desktop')}
        key={title}
      >
        <Icon name={icon} size={48} />
        <h1>{title}</h1>

        {isNotReady && (
          <p className={s.badge}>
            <Badge className="badge-secondary">Coming soon</Badge>
          </p>
        )}
      </button>
    ))}
  </div>
)

export default Menu
