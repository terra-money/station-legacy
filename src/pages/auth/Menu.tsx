import React from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import Icon from '../../components/Icon'
import { Item } from './Auth'
import s from './Menu.module.scss'

type Props = { list: Item[]; onSelect: (index: number) => void }

const Menu = ({ list, onSelect }: Props) => {
  const { t } = useTranslation()

  return (
    <div className={s.list}>
      {list.map(({ title, icon, disabled }, index) => {
        const attrs = {
          disabled,
          className: c(s.item),
          onClick: () => onSelect(index),
          children: (
            <>
              <Icon name={icon} size={40} />
              <h1>{t(title)}</h1>
              <Icon name="chevron_right" className={s.chevron} />
            </>
          )
        }

        return disabled ? null : <button {...attrs} key={title} />
      })}
    </div>
  )
}

export default Menu
