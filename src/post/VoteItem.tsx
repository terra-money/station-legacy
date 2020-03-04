import React from 'react'
import c from 'classnames'
import { Field } from '@terra-money/use-station'
import s from './VoteItem.module.scss'

const VoteItem = ({ attrs, setValue, label, ui }: Field<{ color: string }>) => {
  const { color } = ui!
  const style = attrs.checked
    ? { background: color, color: 'white' }
    : { borderColor: color, color }

  return (
    <div className={s.option}>
      <input {...attrs} onChange={() => setValue?.('')} hidden />
      <label
        htmlFor={attrs.id}
        className={c(s.label, attrs.checked && s.checked)}
        style={style}
      >
        {label}
      </label>
    </div>
  )
}

export default VoteItem
