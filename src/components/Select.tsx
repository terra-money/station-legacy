import React, { FC, DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import Icon from './Icon'
import s from './Select.module.scss'

type Props = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>

const Select: FC<Props> = attrs => (
  <div className={s.container}>
    <select {...attrs} />
    <Icon name="arrow_drop_down" size={20} />
  </div>
)

export default Select
