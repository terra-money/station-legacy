import React from 'react'
import { format } from '../../utils'
import ChartCard from './ChartCard'

interface Results {
  totalAccountCount: number
  monthlyActive: string
  data: {
    datetime: number
    totalAccountCount: number
    activeAccountCount: number
  }[]
}

const TotalAccounts = () => (
  <ChartCard
    title="Total accounts"
    url="/v1/dashboard/account_growth"
    renderHeader={(
      { totalAccountCount, monthlyActive }: Results,
      { additionalIndex }
    ) => {
      const value = !additionalIndex ? totalAccountCount : monthlyActive
      return (
        <span style={{ fontSize: 20 }}>
          {format.decimal(value, 0)}
          <small> Accounts</small>
        </span>
      )
    }}
    getChartProps={({ data }: Results, index) => ({
      type: 'line',
      data: data.map(({ datetime, ...count }) => ({
        t: new Date(datetime),
        y: [count.totalAccountCount, count.activeAccountCount][index]
      })),
      options: {
        tooltips: {
          callbacks: {
            title: ([{ value = '' }]) => format.decimal(value, 0)
          }
        }
      },
      lineStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        lineTension: 0
      }
    })}
    variableY
  />
)

export default TotalAccounts
