import React, { useState } from 'react'
import { Mnemonics as Props } from '@terra-money/use-station'
import InvalidFeedback from '../components/InvalidFeedback'
import Mnemonic from './Mnemonic'
import s from './Mnemonics.module.scss'

const Mnemonics = ({ title, fields, warning, paste, suggest }: Props) => {
  const [currentFocusIndex, setCurrentFocusIndex] = useState<number>()

  return (
    <section className="form-group">
      <label className="label">{title}</label>
      <ul className={s.list}>
        {fields.map(({ label, attrs, setValue }, index) => (
          <Mnemonic
            label={label}
            attrs={{
              ...attrs,
              onFocus: () => setCurrentFocusIndex(index),
              onChange: (e) => setValue?.(e.target.value),
              onPaste: (e) => {
                e.preventDefault()
                const clipboard = e.clipboardData.getData('text')
                paste(clipboard, index)
              },
            }}
            isFocused={index === currentFocusIndex}
            suggest={suggest}
            onSelect={(w) => {
              setValue?.(w)
              setCurrentFocusIndex((i = 0) =>
                i + 1 < fields.length ? i + 1 : i
              )
            }}
            key={index}
          />
        ))}
      </ul>

      {warning && (
        <InvalidFeedback className={s.warning}>{warning}</InvalidFeedback>
      )}
    </section>
  )
}

export default Mnemonics
