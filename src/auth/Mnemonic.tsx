import React, { useRef, useState, useEffect } from 'react'
import 'intersection-observer'
import { useInView } from 'react-intersection-observer'
import c from 'classnames'
import s from './Mnemonic.module.scss'

type ButtonAttrs = React.ButtonHTMLAttributes<HTMLButtonElement>

interface ButtonProps {
  isFocused: boolean
  attrs: ButtonAttrs
  onFocusHidden: () => void
}

const Button: React.FC<ButtonProps> = (props) => {
  const { isFocused, attrs, onFocusHidden, children } = props
  const [ref, inView, entry] = useInView({ threshold: 0.99 })

  useEffect(() => {
    isFocused && !inView && entry && onFocusHidden()
    // eslint-disable-next-line
  }, [isFocused, inView])

  return (
    <button ref={ref} {...attrs}>
      {children}
    </button>
  )
}

interface Props {
  label: string
  attrs: React.InputHTMLAttributes<HTMLInputElement>
  isFocused: boolean
  suggest: (word: string) => string[]
  onSelect: (s: string) => void
}

const Mnemonic: React.FC<Props> = (props) => {
  const { label, attrs, onSelect, isFocused, suggest } = props
  const { value } = attrs

  const containerRef = useRef<HTMLUListElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevRef = useRef<number>(0)

  /* Suggestions */
  const suggestions = suggest(value as string)
  const showSuggestions = isFocused && !!suggestions.length

  /* Suggestions: index */
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [nextIndex, setNextIndex] = useState(0)

  const increase = () =>
    setCurrentIndex((i) => (i + 1 < suggestions.length ? i + 1 : 0))
  const decrease = () =>
    setCurrentIndex((i) => (i - 1 >= 0 ? i - 1 : suggestions.length - 1))

  useEffect(() => {
    prevRef.current = currentIndex
  }, [currentIndex])

  const isIncreasing = currentIndex > prevRef.current

  /* if word changed, reset suggestions index */
  useEffect(() => {
    setCurrentIndex(0)
  }, [value])

  /* auto focus on select previous input */
  useEffect(() => {
    isFocused && inputRef.current && inputRef.current.focus()
  }, [isFocused])

  /* event handler: Keyboard - Enter, Up & Down */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const next: { [key: string]: () => void } = {
      ArrowDown: increase,
      ArrowUp: decrease,
      Enter: () => onSelect(suggestions[currentIndex]),
      Tab: () => onSelect(suggestions[currentIndex]),
    }

    if (next[e.key]) {
      e.preventDefault()
      next[e.key]()
    }
  }

  /* render */
  const small = !!value || isFocused

  return (
    <li className={s.item}>
      <span className={c(s.number, small && s.small)}>{label}.</span>

      <input
        {...attrs}
        ref={inputRef}
        onKeyDown={showSuggestions ? handleKeyDown : undefined}
        className={s.input}
      />

      {showSuggestions && (
        <ul
          ref={containerRef}
          onMouseEnter={() => setCurrentIndex(-1)}
          onMouseLeave={() => setCurrentIndex(nextIndex)}
          className={c(s.suggestions, currentIndex === -1 && s.hover)}
        >
          {suggestions.map((w, index) => {
            const isFocused = index === currentIndex

            /* scroll */
            const itemHeight = 32

            const adjustScroll = (element: HTMLUListElement) => {
              const { height } = element.getBoundingClientRect()

              const scrollTo = isIncreasing
                ? (currentIndex + 1) * itemHeight - height
                : currentIndex * itemHeight

              element.scrollTo(0, scrollTo)
            }

            const attrs: ButtonAttrs = {
              type: 'button',
              className: c(isFocused && s.active),
              style: { height: itemHeight },
              onClick: () => onSelect(w),
              onMouseOver: () => setNextIndex(index),
            }

            return (
              <li key={w}>
                <Button
                  attrs={attrs}
                  isFocused={isFocused}
                  onFocusHidden={() =>
                    containerRef.current && adjustScroll(containerRef.current)
                  }
                >
                  {w}
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

export default Mnemonic
