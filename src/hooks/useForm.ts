import { useState, ChangeEvent } from 'react'
import { sanitize } from '../utils'

type Error = { [key: string]: string }

type Return = {
  invalid: boolean
  touched: { [key: string]: boolean }
  error: Error
  reset: () => void
  handleChange: (e: ChangeEvent<HTMLFieldElement>) => void
  changeValue: (params: { [name: string]: any }, withoutTouch?: boolean) => void
}

export default <T>({
  initial,
  validate,
  parse
}: {
  initial: T | (() => T)
  validate?: (values: T) => Error
  parse?: (values: T) => T
}): { values: T } & Return => {
  const [values, setValues] = useState<T>(initial)

  const initTouched = () =>
    Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: false }), {})
  const [touched, setTouched] = useState<Return['touched']>(initTouched)

  const changeValue: Return['changeValue'] = (params, withoutTouch = false) => {
    /* values */
    const nextValues = { ...values, ...params }
    setValues(Object.assign({}, nextValues, parse && parse(nextValues)))

    /* touched */
    const reducer = (acc: any, name: string) => ({ ...acc, [name]: true })
    const nextTouched = Object.keys(params).reduce(reducer, {})
    !withoutTouch && setTouched(Object.assign({}, touched, nextTouched))
  }

  const handleChange = (e: ChangeEvent<HTMLFieldElement>) => {
    const { name, value } = e.target
    const next: { [name: string]: string } = {
      input: sanitize(value),
      address: value.trim()
    }

    changeValue({ [name]: next[name] || value })
  }

  const reset: Return['reset'] = () => {
    setValues(initial)
    setTouched(initTouched)
  }

  const error = validate ? validate(values) : {}
  const invalid = Object.values(error).some(v => !!v)

  return { values, changeValue, handleChange, reset, touched, error, invalid }
}
