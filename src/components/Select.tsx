import React, { FC, ChangeEvent } from 'react'
import Icon from './Icon'
import s from './Select.module.scss'

type Props = {
  name: string
  value: string | number
  className: string
  autoComplete?: 'off'
  disabled?: boolean
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

const Select: FC<Props> = attrs => (
  <div className={s.container}>
    <select {...attrs} />
    <Icon name="arrow_drop_down" size={20} />
  </div>
)

export default Select
