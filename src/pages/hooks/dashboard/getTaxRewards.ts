import { TFunction } from 'i18next'
import { CumulativeType } from '../../../types'
import { format, sum, minus, times } from '../../../utils'
import { Props } from './useChartCard'

interface Result {
  datetime: number
  blockReward: string
}

export default (
  t: TFunction,
  denom: string,
  krwRate: string
): Props<Result> => {
  const exchange = (n: string): string => times(n, krwRate)

  return {
    title: t('Page:Chart:Tax rewards'),
    desc: t('Page:Chart:Tax rewards distributed over the selected time period'),
    url: '/v1/dashboard/block_rewards',
    filterConfig: { type: { initial: CumulativeType.C } },
    getValue: (data, { type, duration }) => {
      const results = data.slice(duration ? -1 * duration : undefined)
      const { blockReward: head } = results.length
        ? results[0]
        : { blockReward: '0' }
      const { blockReward: tail } =
        results.length > 1 ? results[results.length - 1] : { blockReward: head }
      const amount = exchange(
        type === CumulativeType.C
          ? minus(tail, head)
          : sum(results.slice(1).map((d) => d.blockReward))
      )

      return format.display({ amount, denom })
    },
    getChart: (results, { duration }) => ({
      data: (
        results?.map(({ datetime, blockReward }) => ({
          t: new Date(datetime),
          y: format.amountN(exchange(blockReward)),
        })) ?? []
      ).slice(duration ? -1 * duration : undefined),
      tooltips: (
        results?.map(({ datetime, blockReward }) => ({
          title: format.coin(
            { amount: exchange(blockReward), denom },
            undefined,
            { integer: true }
          ),
          label: new Date(datetime).toUTCString(),
        })) ?? []
      ).slice(duration ? -1 * duration : undefined),
    }),
  }
}
