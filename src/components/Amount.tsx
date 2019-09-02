import React from 'react'
import { format } from '../utils'

type Props = {
  estimated?: boolean
  hideDecimal?: boolean
  fontSize?: number
  className?: string
  denom?: string
  children?: string
}

const Amount = (props: Props) => {
  const { estimated, hideDecimal, fontSize, className, denom, children } = props
  const [integer, decimal] = format.amount(children || '0').split('.')
  return (
    <span className={className} style={{ fontSize }}>
      {estimated && '≈ '}
      {integer}

      <small>
        {!hideDecimal && `.${decimal}`}
        {denom && ` ${format.denom(denom)}`}
      </small>
    </span>
  )
}

export default Amount
