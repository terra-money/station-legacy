import React from 'react'
import c from 'classnames'
import Icon from '../../components/Icon'
import Badge from '../../components/Badge'
import Pop from '../../components/Pop'
import { Item } from './Auth'
import s from './Menu.module.scss'

type Props = { list: Item[]; onSelect: (index: number) => void }

const Menu = ({ list, onSelect }: Props) => (
  <div className={s.list}>
    {list.map(({ title, icon, isNotReady, disabled }, index) => {
      const attrs = {
        disabled,
        className: c(s.item, isNotReady && 'desktop'),
        onClick: () => onSelect(index),
        children: (
          <>
            <Icon name={icon} size={48} />
            <h1>{title}</h1>

            {isNotReady && (
              <p className={s.badge}>
                <Badge className="badge-secondary">Coming soon</Badge>
              </p>
            )}
          </>
        )
      }

      return disabled && !isNotReady ? (
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
