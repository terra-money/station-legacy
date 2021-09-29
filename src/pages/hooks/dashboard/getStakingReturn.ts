import { TFunction } from 'i18next'
import { CumulativeType } from '../../../types'
import { percent, toNumber, times } from '../../../utils'
import { Props } from './useChartCard'

interface Result {
  datetime: number
  dailyReturn: string
  annualizedReturn: string
}

export default (t: TFunction): Props<Result> => ({
  title: t('Page:Chart:Staking return'),
  desc: t(
    'Page:Chart:Annualized staking yield for Luna based on tax rewards, oracle rewards, gas, MIR and ANC airdrop rewards and latest prices of Luna (annualize return = 10 days moving average return * 365)'
  ),
  url: '/v1/dashboard/staking_return',
  filterConfig: { type: { initial: CumulativeType.C } },
  cumulativeLabel: {
    [CumulativeType.C]: t('Page:Chart:Annualized'),
    [CumulativeType.P]: t('Page:Chart:Daily'),
  },
  getValue: (results, { type }) => {
    const isAnnualized = type === CumulativeType.C
    const key = isAnnualized ? 'annualizedReturn' : 'dailyReturn'
    const unit = isAnnualized ? t('Page:Chart:/ year') : t('Page:Chart:/ day')

    return [
      percent(results.length ? results[results.length - 1][key] : 0),
      unit,
    ]
  },
  getChart: (results, { type, duration }) => {
    const key = type === CumulativeType.C ? 'annualizedReturn' : 'dailyReturn'
    return {
      data: (
        results?.map(({ datetime, ...rest }) => ({
          t: new Date(datetime),
          y: toNumber(times(rest[key], 100)),
        })) ?? []
      ).slice(duration ? -1 * duration : undefined),
      tooltips: (
        results?.map(({ datetime, ...rest }) => ({
          title: percent(rest[key]),
          label: new Date(datetime).toUTCString(),
        })) ?? []
      ).slice(duration ? -1 * duration : undefined),
    }
  },
})
