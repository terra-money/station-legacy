import { useTranslation } from 'react-i18next'
import { ChartCard, ChartKey } from '../../../types'
import { useCurrency, useCurrencyRates } from '../../../data/currency'
import useChartCard from './useChartCard'
import getTxVolume from './getTxVolume'
import getStakingReturn from './getStakingReturn'
import getTaxRewards from './getTaxRewards'
import getTotalAccounts from './getTotalAccounts'

export default (key: ChartKey): ChartCard => {
  const { t } = useTranslation()
  const currency = useCurrency()
  const { getRate } = useCurrencyRates()

  const props = {
    TxVolume: getTxVolume(t),
    StakingReturn: getStakingReturn(t),
    TaxRewards: getTaxRewards(t, currency, getRate(currency, 'ukrw')),
    TotalAccounts: getTotalAccounts(t),
  }

  const chart = useChartCard(props[key])
  return chart
}
