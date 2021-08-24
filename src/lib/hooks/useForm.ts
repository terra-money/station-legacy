import { useState, Dispatch, SetStateAction } from 'react'
import { Assign, Field, FieldAttrs } from '../types'

type DefaultProps = Pick<Field, 'element' | 'setValue' | 'error'>
interface DefaultAttrs<T> extends Pick<FieldAttrs, 'type' | 'autoComplete'> {
  id: keyof T
  name: keyof T
  value: string
}

export default <T>(
  initial: T | (() => T),
  validate: (values: T) => Assign<T, string>
): {
  values: T
  setValue: (name: keyof T, value: string) => void
  setValues: Dispatch<SetStateAction<T>>
  invalid: boolean
  getDefaultProps: (name: keyof T) => DefaultProps
  getDefaultAttrs: (name: keyof T) => DefaultAttrs<T>
} => {
  const [values, setValues] = useState<T>(initial)
  const [touched, setTouched] = useState<Partial<Assign<T, boolean>>>({})

  const setValue = (name: keyof T, value: string) => {
    const next = name === 'input' ? sanitize(value) : value
    setValues((values) => ({ ...values, [name]: next }))
    setTouched((touched) => ({ ...touched, [name]: true }))
  }

  const errors = validate(values)

  return {
    values,
    setValue,
    setValues,
    invalid: Object.values(errors).some((v) => !!v),
    getDefaultProps: (name) => ({
      element: 'input',
      setValue: (value) => setValue(name, value),
      error: touched[name] ? errors[name] : '',
    }),
    getDefaultAttrs: (name) => ({
      type: 'text' as const,
      id: name,
      name,
      value: String(values[name]),
      autoComplete: 'off',
    }),
  }
}

/* helper */
const sanitize = (v: string = '') => (v ? v.replace(/[^\d.]/g, '') : '')
