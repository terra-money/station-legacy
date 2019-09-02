import React from 'react'
import { div } from '../../api/math'
import Amount from '../../components/Amount'
import ChartCard from './ChartCard'

interface Result {
  datetime: number
  seigniorageProceeds: string
}

type Results = Result[]
const SeigniorageProceeds = () => (
  <ChartCard
    title="Seigniorage proceeds"
    url="/v1/dashboard/seigniorage_proceeds"
    renderHeader={(results: Results) => (
      <Amount hideDecimal>
        {results[results.length - 1].seigniorageProceeds}
      </Amount>
    )}
    getChartProps={(results: Results) => ({
      type: 'line',
      data: results.map(({ datetime, seigniorageProceeds }) => ({
        t: new Date(datetime),
        y: div(seigniorageProceeds, 1e6)
      }))
    })}
  />
)

export default SeigniorageProceeds
