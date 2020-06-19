import React, { FC, FormEvent, ReactNode } from 'react'
import c from 'classnames'
import { FormUI, Field as FieldProps } from '@terra-money/use-station'
import { ReactComponent as SwapIcon } from '../images/Swap.svg'
import Field from './Field'
import Icon from './Icon'
import ButtonWithAuth from './ButtonWithAuth'
import s from './FormSwap.module.scss'

interface Props {
  form: FormUI
  message: string
  contents: ReactNode[]
  disabled?: boolean
  renderField?: (field: FieldProps) => ReactNode
}

const Form: FC<Props> = ({ form, message, contents, ...props }) => {
  const { fields, submitLabel, onSubmit } = form
  const disabled = props.disabled || form.disabled

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  const n = 2
  const [left, right] = contents

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <p className={s.p}>
        <Icon name="info" />
        {message}
      </p>

      <div className="row">
        <section className="col col-5">
          {fields.slice(0, n).map((field) => (
            <Field field={field} key={field.attrs.id} />
          ))}

          {left}
        </section>

        <section className="col col-2">
          <div className={s.arrow}>
            <SwapIcon />
          </div>
        </section>

        <section className="col col-5">
          {fields.slice(n).map((field) => (
            <Field field={field} key={field.attrs.id} />
          ))}

          {right}
        </section>
      </div>

      <ButtonWithAuth
        type="submit"
        className={c('btn btn-block btn-primary', s.submit)}
        disabled={disabled}
      >
        {submitLabel}
      </ButtonWithAuth>
    </form>
  )
}

export default Form
