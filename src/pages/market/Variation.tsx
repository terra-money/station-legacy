import React from 'react'
import c from 'classnames'
import { Variation as VariationProps } from '@terra-money/use-station'
import { gt, lt } from '@terra-money/use-station'
import Icon from '../../components/Icon'
import Number from '../../components/Number'
import s from './Variation.module.scss'

interface Props {
  variation: VariationProps
  showPercent?: boolean
}

const Variation = ({ variation, showPercent }: Props) => {
  const { amount, value, percent } = variation
  const inc = gt(amount, 0)
  const dec = lt(amount, 0)

  const icon = inc ? 'arrow_drop_up' : dec ? 'arrow_drop_down' : undefined
  const color = inc ? 'text-danger' : dec ? 'text-success' : 'text-muted'

  const tail = `${inc ? '+' : ''}${percent}`

  return (
    <>
      <div className={c('flex', color, showPercent && s.inline)}>
        {icon && <Icon name={icon} />}
        {showPercent ? <Number>{value}</Number> : value}
      </div>

      {showPercent && (
        <span className={c('text-right', s.percent, color)}>({tail})</span>
      )}
    </>
  )
}

export default Variation
