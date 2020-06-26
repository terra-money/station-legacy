import React, { ReactNode } from 'react'
import { MyDelegations as Item } from '@terra-money/use-station'
import Chart from '../../components/Chart'
import Number from '../../components/Number'
import s from './StakingChart.module.scss'

type Props = {
  item: Item
  renderTabs: () => ReactNode
}

const StakingChart = ({ item, renderTabs }: Props) => {
  const { title, sum, chart } = item
  return (
    <>
      <div style={{ width: 240, height: 240 }} className={s.chart}>
        <Chart
          type="doughnut"
          labels={chart.map((c) => c.label)}
          data={chart.map((c) => c.data)}
          width={240}
          height={240}
        />
        <section className={s.total}>
          <h1>{title}</h1>
          <Number fontSize={20}>{sum.value}</Number>
        </section>
      </div>

      <section className={s.tabs}>{renderTabs()}</section>
    </>
  )
}

export default StakingChart
