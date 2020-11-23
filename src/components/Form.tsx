import React, { FormEvent, ReactNode, useState } from 'react'
import { FormUI, Field as FieldProps } from '@terra-money/use-station'
import Field from './Field'
import s from './Form.module.scss'

export interface Props {
  form: FormUI
  actions?: ReactNode
  h2?: ReactNode
  disabled?: boolean
  cancel?: { onClick: () => void; children: string }
  reversed?: boolean
  className?: string
  children?: ReactNode
  renderField?: (field: FieldProps) => ReactNode
  render?: (params: State) => ReactNode
}

export interface State {
  index: number
  setIndex: (index: number) => void
}

const Form = ({ form, h2, renderField, render, children, ...props }: Props) => {
  const { actions, cancel, reversed, className } = props
  const { title, fields, submitLabel, onSubmit } = form
  const disabled = props.disabled || form.disabled
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number>(-1)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className={s.header}>
        <h1>{title}</h1>
        {actions}
        {h2 && <h2>{h2}</h2>}
      </header>

      {reversed && children}

      <section className={className}>
        {fields.map((field, index) =>
          field.attrs.hidden ? null : (
            <Field
              field={field}
              focus={index === currentFieldIndex}
              onFocus={() => setCurrentFieldIndex(index)}
              render={renderField}
              key={field.attrs.id}
            />
          )
        )}
      </section>

      {!reversed && children}
      {render?.({ index: currentFieldIndex, setIndex: setCurrentFieldIndex })}

      <footer className={s.submit}>
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          {submitLabel}
        </button>

        {cancel && (
          <button type="button" className="btn btn-danger" {...cancel} />
        )}
      </footer>
    </form>
  )
}

export default Form
