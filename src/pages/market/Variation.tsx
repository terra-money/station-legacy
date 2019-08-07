import React, { ReactNode } from 'react'
import c from 'classnames'
import { lt, percent, times } from '../../api/math'
import { format } from '../../utils'
import Icon from '../../components/Icon'
import Amount from '../../components/Amount'
import s from './Variation.module.scss'

type Props = { inline?: boolean; render: (elements: ReactNode[]) => ReactNode }
const Variation = ({ inline, render, ...variation }: Props & Variation) => {
  const { oneDayVariation, oneDayVariationRate } = variation
  const decreased = lt(oneDayVariation, 0)

  const icon = !decreased ? 'arrow_drop_up' : 'arrow_drop_down'
  const color = !decreased ? 'text-success' : 'text-danger'

  const h = oneDayVariation
  const t = `${!decreased ? '+' : ''}${percent(oneDayVariationRate)}`

  return render([
    <div className={c('flex', color, inline && s.inline)}>
      {icon && <Icon name={icon} />}
      {inline ? <Amount>{times(h, 1e6)}</Amount> : format.decimal(h)}
    </div>,

    <span className={c('text-right', s.percent, color)}>
      {inline ? `(${t})` : t}
    </span>
  ])
}

export default Variation
