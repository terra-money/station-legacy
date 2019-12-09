import React, { DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import Icon from './Icon'
import s from './Select.module.scss'

interface Props
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  width?: number
}

const Select = ({ width, ...attrs }: Props) => (
  <div className={s.container} style={{ width }}>
    <select {...attrs} />
    <Icon name="arrow_drop_down" size={20} />
  </div>
)

export default Select
