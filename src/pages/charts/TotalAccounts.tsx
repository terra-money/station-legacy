import React from 'react'
import { useTranslation } from 'react-i18next'
import { format } from '../../utils'
import ChartCard from './ChartCard'
import { minus, sum } from '../../api/math'

interface Result {
  datetime: number
  totalAccountCount: number
  activeAccountCount: number
}

type Results = Result[]

const TotalAccounts = () => {
  const { t } = useTranslation()
  return (
    <ChartCard
      title={t('Total accounts')}
      description={t(
        'Number of total accounts with more than 1 non-trivial transaction in the selected period'
      )}
      url="/v1/dashboard/account_growth"
      cumulativeOptions={{ initial: true }}
      renderHeader={(results: Results, { cumulative }) => {
        const { totalAccountCount: head } = results[0]
        const { totalAccountCount: tail } = results[results.length - 1]
        const value = cumulative
          ? minus(tail, head)
          : sum(results.slice(1).map(d => d.totalAccountCount))

        return (
          <span style={{ fontSize: 20 }}>
            {format.decimal(value, 0)}
            <small> Accounts</small>
          </span>
        )
      }}
      getChartProps={(results: Results) => ({
        type: 'line',
        data: results.map(({ datetime, ...count }) => ({
          t: new Date(datetime),
          y: count.totalAccountCount
        })),
        options: {
          tooltips: {
            callbacks: {
              title: ([{ value = '' }]) => format.decimal(value, 0)
            }
          }
        },
        lineStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0)'
        }
      })}
    />
  )
}

export default TotalAccounts
