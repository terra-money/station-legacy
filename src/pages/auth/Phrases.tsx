import React, { useState } from 'react'
import { update } from 'ramda'
import Menmonic from './Mnemonic'
import s from './Phrases.module.scss'

type Props = {
  list: string[]
  onChange: (phrases: string[]) => void
}

const Phrases = ({ list, onChange }: Props) => {
  const [currentFocusIndex, setCurrentFocusIndex] = useState<number>()

  return (
    <ul className={s.list}>
      {list.map((word, index) => {
        const updateWord = (s: string) =>
          onChange(update(index, sanitize(s), list))

        return (
          <Menmonic
            key={index}
            index={index}
            word={word}
            isFocused={index === currentFocusIndex}
            onSelect={w => {
              updateWord(w)
              setCurrentFocusIndex((i = 0) => (i + 1 < list.length ? i + 1 : i))
            }}
            attrs={{
              name: 'word',
              value: word,
              onChange: e => updateWord(e.target.value),
              onFocus: () => setCurrentFocusIndex(index),
              onPaste: e => {
                e.preventDefault()
                const clipboard = e.clipboardData.getData('text')
                const next = toArray(clipboard)
                onChange(paste(index, next, list))
              },
              autoComplete: 'off'
            }}
          />
        )
      })}
    </ul>
  )
}

export default Phrases

/* utils */
const sanitize = (s: string = '') => s.toLowerCase().replace(/[^a-z]/g, '')
const toArray = (s: string) =>
  s
    .trim()
    .replace(/\s\s+/g, ' ')
    .split(' ')
    .map(sanitize)

export const paste = (index: number, next: string[], list: string[]) => {
  const head = list.slice(0, index)
  const tail = list.slice(index + next.length)
  return [...head, ...next, ...tail].slice(0, list.length)
}
