import React, { FC } from 'react'
import c from 'classnames'
import s from './Checkbox.module.scss'

type Props = { onClick: () => void; checked: boolean }

const Checkbox: FC<Props> = ({ onClick, checked, children }) => (
  <button className={s.component} onClick={onClick}>
    <span className={c(s.input, checked && s.checked)} />
    <span>{children}</span>
  </button>
)

export default Checkbox
