import React from 'react'
import { times, percent } from '../../api/math'
import { format } from '../../utils'
import ChartCard from './ChartCard'

interface Result {
  datetime: number
  dailyReturn: string
  annualizedReturn: string
}

type Results = Result[]
const StakingReturn = () => (
  <ChartCard
    title="Staking return"
    url="/v1/dashboard/staking_return"
    renderHeader={(results: Results) => (
      <span style={{ fontSize: 20 }}>
        {percent(results[results.length - 1].annualizedReturn)}
        <small> / year</small>
      </span>
    )}
    getChartProps={(results: Results) => ({
      type: 'line',
      data: results.map(({ datetime, annualizedReturn }) => ({
        t: new Date(datetime),
        y: times(annualizedReturn, 100)
      })),
      options: {
        scales: {
          yAxes: [{ ticks: { callback: v => `${v}%` } }]
        },
        tooltips: {
          callbacks: {
            title: ([{ value = '' }]) => `${format.decimal(value, 2)}%`
          }
        }
      },
      lineStyle: {
        borderColor: 'rgba(32, 67, 181, 0.25)',
        backgroundColor: 'rgba(32, 67, 181, 0.25)'
      }
    })}
  />
)

export default StakingReturn
