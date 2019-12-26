import React from 'react'
import c from 'classnames'
import s from './RadioGroup.module.scss'

interface Props {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

const RadioGroup = ({ options, value: selected, onChange }: Props) => (
  <div className={s.wrapper}>
    {options.map(({ value, label }, index) => {
      const isSelected = value === selected
      return (
        <button
          onClick={() => !isSelected && onChange(value)}
          className={c(s.button, isSelected && s.active)}
          key={index}
        >
          {label}
        </button>
      )
    })}
  </div>
)

export default RadioGroup
