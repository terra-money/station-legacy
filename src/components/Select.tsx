import React, { DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import c from 'classnames'
import Icon from './Icon'
import s from './Select.module.scss'

type Attrs = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>

interface Props extends Attrs {
  width?: number
}

const Select = ({ width, className, ...attrs }: Props) => (
  <div className={s.container} style={{ width }}>
    <select {...attrs} className={c(className, s.select)} />
    <Icon name="arrow_drop_down" size={20} />
  </div>
)

export default Select
