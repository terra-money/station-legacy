import React from 'react'
import { div, sum } from '../../api/math'
import { format } from '../../utils'
import Amount from '../../components/Amount'
import Flex from '../../components/Flex'
import ChartCard from './ChartCard'

interface Result {
  denom: string
  data: { datetime: number; txVolume: string }[]
}

type Results = Result[]
const TxVolume = () => (
  <ChartCard
    title="Transaction volume"
    url="/v1/dashboard/tx_volume"
    initialAdditionalIndex={1}
    durations={[1, 7, 30, 0]}
    initialDuration={1}
    additionalSelector={(results: Results) =>
      results.map(({ denom }: { denom: string }) => format.denom(denom))
    }
    renderHeader={(results: Results, { additionalIndex, duration }) => {
      const { denom, data } = results[additionalIndex]
      const lastData = data[data.length - 1]

      return (
        <Flex>
          <Amount denom={denom} fontSize={20} hideDecimal>
            {duration === 1
              ? lastData.txVolume
              : sum(data.map(d => d.txVolume))}
          </Amount>
        </Flex>
      )
    }}
    getChartProps={(results: Results, index: number) => ({
      type: 'line',
      data: results[index].data.map(({ datetime, txVolume }) => ({
        t: new Date(datetime),
        y: div(txVolume, 1e6)
      })),
      options: {
        tooltips: {
          callbacks: {
            title: ([{ value = '' }]) =>
              `${format.decimal(value, 0)} ${format.denom(
                results[index].denom
              )}`
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

export default TxVolume
