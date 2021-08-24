import { DisplayCoin } from '..'

export interface FormUI<U = any> {
  title: string
  fields: Field<U>[]
  errors?: string[]
  disabled: boolean
  submitLabel: string
  onSubmit?: () => void | Promise<void>
  submitting?: boolean
}

export type FieldElement = 'input' | 'textarea' | 'select'
export interface Field<U = any> {
  label: string

  element: FieldElement
  attrs: FieldAttrs
  setValue?: (value: string) => void

  error?: string
  copy?: string
  ui?: U

  /* post */
  unit?: string
  button?: FieldButton

  /* select */
  options?: Options
}

export interface FieldAttrs {
  type?: 'text' | 'number' | 'password' | 'checkbox' | 'radio' | 'file'

  id: string
  name?: string
  disabled?: boolean

  /* text | password */
  value?: string
  defaultValue?: string

  /* checkbox | radio */
  checked?: boolean

  /* optional */
  placeholder?: string
  autoComplete?: 'off'
  autoFocus?: boolean
  readOnly?: boolean
  hidden?: boolean
}

interface FieldButton {
  label: string
  display: DisplayCoin
  attrs: { onClick: () => void }
}

export interface ButtonAttrs {
  onClick: () => void
  children: string
}

export type Options = Option[]
export type Option = {
  value: string
  children: string
  disabled?: boolean
  icon?: string
  balance?: string
}
