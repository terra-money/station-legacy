import { HTMLAttributes } from 'react'
import { DisplayCoin } from '../lib'
import Number from './Number'

interface Props {
  attrs: HTMLAttributes<HTMLButtonElement>
  label: string
  display: DisplayCoin
}

const MaxButton = ({ attrs, label, display }: Props) => (
  <>
    {label}:{' '}
    <button type="button" {...attrs} className="btn-link">
      <Number>{display.value}</Number>
    </button>
  </>
)

export default MaxButton
