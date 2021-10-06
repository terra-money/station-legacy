import { TFunction } from 'i18next'
import { CumulativeType } from '../../../types'
import { format, sum, minus } from '../../../utils'
import { Props } from './useChartCard'

interface Result {
  denom: string
  data: { datetime: number; txVolume: string }[]
}

export default (t: TFunction): Props<Result> => ({
  title: t('Page:Chart:Transaction volume'),
  desc: t(
    'Page:Chart:The onchain transaction volume for the selected currency over the selected time period'
  ),
  url: '/v1/dashboard/tx_volume',
  filterConfig: {
    type: { initial: CumulativeType.P },
    duration: { initial: 3, list: [0, 3, 7, 14, 30] },
    denom: { initial: 'uusd' },
  },
  getValue: (results, { type, denom, duration }) => {
    const result = results.find((r) => r.denom === denom)

    const render = (result: Result) => {
      const { denom } = result
      const data = result.data.slice(duration ? -1 * duration : undefined)
      const { txVolume: head } = data.length ? data[0] : { txVolume: '0' }
      const { txVolume: tail } =
        data.length > 1 ? data[data.length - 1] : { txVolume: head }
      const { txVolume: secondTail } =
        data.length > 2 ? data[data.length - 2] : { txVolume: tail }
      const isCumulative = type === CumulativeType.C

      const value = isCumulative
        ? minus(tail, head)
        : sum(data.slice(1).map((d) => d.txVolume))

      const lastDayValue = isCumulative ? minus(tail, secondTail) : tail
      const amount = duration !== 3 ? value : lastDayValue

      return format.display({ amount, denom })
    }

    return result ? render(result) : undefined
  },
  getChart: (results, { denom, duration }) => {
    const result = results.find((r) => r.denom === denom)
    return {
      data: (
        result?.data.map(({ datetime, txVolume }) => ({
          t: new Date(datetime),
          y: format.amountN(txVolume),
        })) ?? []
      ).slice(duration ? -1 * duration : undefined),
      tooltips: (
        result?.data.map(({ datetime, txVolume }) => ({
          title: format.coin(
            { amount: txVolume, denom: result.denom },
            undefined,
            { integer: true }
          ),
          label: new Date(datetime).toUTCString(),
        })) ?? []
      ).slice(duration ? -1 * duration : undefined),
    }
  },
})
