import React from 'react'
import c from 'classnames'
import Icon from '../../components/Icon'
import Pop from '../../components/Pop'
import { Item } from './Auth'
import s from './Menu.module.scss'

type Props = { list: Item[]; onSelect: (index: number) => void }

const Menu = ({ list, onSelect }: Props) => (
  <div className={s.list}>
    {list.map(({ title, icon, disabled }, index) => {
      const attrs = {
        disabled,
        className: c(s.item),
        onClick: () => onSelect(index),
        children: (
          <>
            <Icon name={icon} size={40} />
            <h1>{title}</h1>
            <Icon name="chevron_right" className={s.chevron} />
          </>
        )
      }

      return disabled ? (
        <Pop
          type="tooltip"
          placement="top"
          content="Please create an account or import with seed first"
          key={title}
        >
          {({ ref, getAttrs }) => (
            <span
              {...getAttrs({ className: c(attrs.className, s.disabled) })}
              ref={ref}
            >
              {attrs.children}
            </span>
          )}
        </Pop>
      ) : (
        <button {...attrs} key={title} />
      )
    })}
  </div>
)

export default Menu
