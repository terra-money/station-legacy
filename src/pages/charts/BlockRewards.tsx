import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { div, minus, sum } from '../../api/math'
import { format } from '../../utils'
import Amount from '../../components/Amount'
import Flex from '../../components/Flex'
import ChartCard from './ChartCard'

interface Result {
  datetime: number
  blockReward: string
}

type Results = Result[]
const denom = 'ukrw'
const BlockRewards = () => {
  const { t } = useTranslation()
  return (
    <ChartCard
      title={t('Block rewards')}
      description={t(
        'Block rewards distributed over the selected time period. Block rewards are a sum of tax proceeds, oracle rewards, and gas fees'
      )}
      url="/v1/dashboard/block_rewards"
      cumulativeOptions={{ initial: true }}
      renderHeader={(results: Results, { cumulative }): ReactNode => {
        const { blockReward: head } = results[0]
        const { blockReward: tail } = results[results.length - 1]
        return (
          <Flex>
            <Amount denom={denom} fontSize={20} hideDecimal>
              {cumulative
                ? minus(tail, head)
                : sum(results.slice(1).map(d => d.blockReward))}
            </Amount>
          </Flex>
        )
      }}
      getChartProps={(results: Results) => ({
        type: 'line',
        data: results.map(({ datetime, blockReward }) => ({
          t: new Date(datetime),
          y: div(blockReward, 1e6)
        })),
        options: {
          tooltips: {
            callbacks: {
              title: ([{ value = '' }]) =>
                `${format.decimal(value, 0)} ${format.denom(denom)}`
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

export default BlockRewards
