import React, { DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import c from 'classnames'
import Icon from './Icon'
import s from './Select.module.scss'

type Attrs = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>

interface Props extends Attrs {
  icon?: string
  width?: number
  containerClassName?: string
}

const Select = ({ icon, width, className, ...props }: Props) => {
  const { containerClassName, ...attrs } = props
  return (
    <div className={c(s.container, containerClassName)} style={{ width }}>
      {icon && <Icon name={icon} size={16} className={s.icon} />}
      <select {...attrs} className={c(className, s.select, icon && s.pl)} />
      <Icon name="arrow_drop_down" size={20} className={s.caret} />
    </div>
  )
}

export default Select
