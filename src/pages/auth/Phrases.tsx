import React, { useState } from 'react'
import { update } from 'ramda'
import c from 'classnames'
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
        const small = !!word || index === currentFocusIndex
        return (
          <li className={s.item} key={index}>
            <span className={c(s.number, small && s.small)}>{index + 1}.</span>
            <input
              name="word"
              value={word}
              onChange={e => {
                onChange(update(index, sanitize(e.target.value), list))
              }}
              onFocus={() => {
                setCurrentFocusIndex(index)
              }}
              onPaste={e => {
                e.preventDefault()
                const clipboard = e.clipboardData.getData('text')
                const next = toArray(clipboard)
                onChange(paste(index, next, list))
              }}
              className={s.input}
              autoComplete="off"
            />
          </li>
        )
      })}
    </ul>
  )
}

export default Phrases

/* utils */
const sanitize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')
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
