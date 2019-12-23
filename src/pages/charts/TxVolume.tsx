import React from 'react'
import { useTranslation } from 'react-i18next'
import { div, sum, minus } from '../../api/math'
import { format } from '../../utils'
import Amount from '../../components/Amount'
import Flex from '../../components/Flex'
import ChartCard from './ChartCard'

interface Result {
  denom: string
  data: { datetime: number; txVolume: string }[]
}

type Results = Result[]
const TxVolume = () => {
  const { t } = useTranslation()
  return (
    <ChartCard
      title={t('Transaction volume')}
      description={t(
        'The onchain transaction volume for the selected currency over the selected time period'
      )}
      url="/v1/dashboard/tx_volume"
      cumulativeOptions={{ initial: false }}
      durationOptions={{ initial: 1, list: [0, 1, 7, 14, 30] }}
      additionalOptions={{
        initial: 'ukrw',
        getList: (results: Results) =>
          !Array.isArray(results)
            ? []
            : results.map(({ denom }: { denom: string }) => ({
                value: denom,
                label: format.denom(denom)
              }))
      }}
      renderHeader={(
        results: Results,
        { cumulative, duration, additional }
      ) => {
        const result = results.find(r => r.denom === additional)

        const render = (result: Result) => {
          const { denom, data } = result
          const { txVolume: head } = data[0]
          const { txVolume: tail } = data[data.length - 1]
          const { txVolume: secondTail } = data[data.length - 2]

          const value = cumulative
            ? minus(tail, head)
            : sum(data.slice(1).map(d => d.txVolume))
          const lastDayValue = cumulative ? minus(tail, secondTail) : tail

          return (
            <Flex>
              <Amount denom={denom} fontSize={20} hideDecimal>
                {duration !== 1 ? value : lastDayValue}
              </Amount>
            </Flex>
          )
        }

        return result ? render(result) : null
      }}
      getChartProps={(results: Results, { additional }) => {
        const result = results.find(r => r.denom === additional)
        return {
          type: 'line',
          data:
            result?.data.map(({ datetime, txVolume }) => ({
              t: new Date(datetime),
              y: div(txVolume, 1e6)
            })) ?? [],
          options: {
            tooltips: {
              callbacks: {
                title: ([{ value = '' }]) =>
                  result
                    ? `${format.decimal(value, 0)} ${format.denom(
                        result.denom
                      )}`
                    : ''
              }
            }
          },
          lineStyle: {
            borderColor: 'rgba(32, 67, 181, 0.25)',
            backgroundColor: 'rgba(32, 67, 181, 0.25)'
          }
        }
      }}
    />
  )
}

export default TxVolume
