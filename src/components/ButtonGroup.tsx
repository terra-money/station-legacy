import React, { HTMLAttributes } from 'react'
import { format } from '@terra-money/use-station'
import s from './ButtonGroup.module.scss'

interface Props {
  buttons: HTMLAttributes<HTMLButtonElement>[]
  truncate?: boolean
}

const ButtonGroup = ({ buttons, truncate }: Props) => (
  <ul className={s.list}>
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
