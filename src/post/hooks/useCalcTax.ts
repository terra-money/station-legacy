import { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { TFunction } from 'i18next'
import BigNumber from 'bignumber.js'
import { format, is } from '../../utils'
import { min, percent } from '../../utils/math'
import fcd from '../../api/fcd'
import useLCD from '../../api/useLCD'

type Response = Result<string>
const useCalcTax = (denom: string, t: TFunction) => {
  const lcd = useLCD()
  const { data: rate = '0', isLoading: loadingRate } = useQuery(
    'taxRate',
    async () => {
      const { data } = await fcd.get<Response>('/treasury/tax_rate')
      return data.result
    }
  )

  const { data: cap = '0', isLoading: loadingCap } = useQuery(
    ['taxCap', denom],
    async () => {
      const data = await lcd.treasury.taxCap(denom)
      return data.amount.toString()
    },
    { enabled: denom !== '' && denom !== 'uluna' && !is.address(denom) }
  )

  const loading = loadingRate || loadingCap

  const getMax = useCallback(
    (balance: string) => {
      const calculated = new BigNumber(balance)
        .times(rate)
        .div(new BigNumber(1).plus(rate))
        .integerValue(BigNumber.ROUND_CEIL)
        .toString()

      const tax = min([calculated, cap])
      const max = new BigNumber(balance).minus(tax).toString()

      return max
    },
    [rate, cap]
  )

  const getTax = useCallback(
    (amount: string) => {
      const tax = new BigNumber(amount).times(rate)

      return BigNumber.min(tax, new BigNumber(cap))
        .integerValue(BigNumber.ROUND_CEIL)
        .toString()
    },
    [cap, rate]
  )

  const label = useMemo(
    () =>
      t('Post:Send:Tax ({{percent}}, Max {{max}})', {
        percent: percent(rate, 3),
        max: format.coin({ amount: cap, denom }),
      }),
    [cap, rate, denom, t]
  )

  return { loading, getMax, getTax, label }
}

export default useCalcTax
