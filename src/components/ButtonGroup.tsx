import React, { HTMLAttributes } from 'react'
import c from 'classnames'
import { format } from '@terra-money/use-station'
import s from './ButtonGroup.module.scss'

interface Props {
  buttons: HTMLAttributes<HTMLButtonElement>[]
  truncate?: boolean
  wrap?: boolean
  column?: boolean
}

const ButtonGroup = ({ buttons, truncate, wrap, column }: Props) => (
  <ul className={c(s.list, wrap && s.wrap, column && s.column)}>
    {buttons.map((attrs, index) => (
      <li className={s.item} key={index}>
        <button type="button" {...attrs}>
          {truncate && typeof attrs.children === 'string'
            ? format.truncate(attrs.children, [9, 7])
            : attrs.children}
        </button>
      </li>
    ))}
  </ul>
)

export default ButtonGroup
