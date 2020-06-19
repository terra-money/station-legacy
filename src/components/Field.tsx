import React, { useRef, useEffect } from 'react'
import { FocusEvent, ChangeEvent, ReactNode } from 'react'
import { Field as FieldProps } from '@terra-money/use-station'
import Copy from './Copy'
import Select from './Select'
import MaxButton from './MaxButton'
import InvalidFeedback from './InvalidFeedback'

interface Props {
  field: FieldProps
  focus?: boolean
  onFocus?: (e: FocusEvent) => void
  render?: (field: FieldProps) => ReactNode
}

const Field = ({ field, focus, onFocus, render }: Props) => {
  const { label, element, attrs, setValue, error } = field
  const { copy, button, unit, options } = field

  /* focus by external */
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    focus && inputRef.current!.focus()
  }, [focus])

  /* event */
  type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  const handleChange = (e: ChangeEvent<InputElement>) =>
    setValue?.(e.target.value)

  /* render */
  const header = label && (
    <div className="flex space-between">
      <label className="label" htmlFor={attrs.id}>
        {label}
      </label>

      {copy && (
        <Copy
          text={copy}
          classNames={{ button: 'label-button text-secondary' }}
        />
      )}

      {button && (
        <p className="label-text">
          <MaxButton {...button} />
        </p>
      )}
    </div>
  )

  const input = (
    <input
      {...attrs}
      className="form-control"
      onChange={handleChange}
      onFocus={onFocus}
      ref={inputRef}
    />
  )

  const elements = {
    input: () =>
      !['checkbox', 'radio'].includes(attrs.type!) ? (
        <div className="form-group">
          {header}

          {!unit ? (
            input
          ) : (
            <div className="input-group">
              {input}
              <div className="input-group-append">
                <span className="input-group-text">{unit}</span>
              </div>
            </div>
          )}

          {error && <InvalidFeedback tooltip>{error}</InvalidFeedback>}
        </div>
      ) : (
        <div className="form-check">
          <input
            {...attrs}
            className="form-check-input"
            onChange={handleChange}
          />

          <label className="form-check-label" htmlFor={attrs.id}>
            {label}
          </label>
        </div>
      ),
    select: () => (
      <div className="form-group">
        {header}
        <Select {...attrs} onChange={handleChange} className="form-control">
          {options?.map((option) => (
            <option {...option} key={option.value} />
          ))}
        </Select>
      </div>
    ),
    textarea: () => (
      <div className="form-group">
        {header}
        <textarea
          {...attrs}
          className="form-control"
          onChange={handleChange}
          rows={3}
        />
        {error && <InvalidFeedback tooltip>{error}</InvalidFeedback>}
      </div>
    ),
  }

  return <>{render?.(field) ?? elements[element]()}</>
}

export default Field
