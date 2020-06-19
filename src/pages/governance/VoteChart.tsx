import React from 'react'
import { path } from 'ramda'
import { ChartPoint, ChartTooltipCallback } from 'chart.js'
import { VoteOption, percent, toNumber, gt } from '@terra-money/use-station'
import Chart from '../../components/Chart'
import Orb from '../../components/Orb'

const VoteChart = ({ options }: { options: VoteOption[] }) => {
  const filtered = options.filter((o) => gt(o.ratio, 0))

  return filtered.length ? (
    <Chart
      type="pie"
      pieBackgroundColors={filtered.map((o) => o.color)}
      labels={filtered.map((o) => o.label)}
      data={filtered.map((o) => toNumber(o.ratio))}
      width={100}
      height={100}
      options={{ tooltips: { callbacks: { label: getLabel } } }}
    />
  ) : (
    <Orb size={100} />
  )
}

export default VoteChart

/* helper */
const getLabel: ChartTooltipCallback['label'] = ({ index }, { datasets }) => {
  const point: ChartPoint =
    (typeof index === 'number' && path([0, 'data', index], datasets)) || {}
  return percent(point as string)
}
