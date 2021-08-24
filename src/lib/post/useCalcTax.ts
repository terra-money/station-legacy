import { useCallback, useEffect, useMemo, useState } from 'react'
import { TFunction } from 'i18next'
import { Result } from '../types'
import { format, is } from '../utils'
import { min, percent } from '../utils/math'
import fcd from '../api/fcd'
import BigNumber from 'bignumber.js'

type Response = Result<string>
const useCalcTax = (denom: string, t: TFunction) => {
  const [rate, setRate] = useState('0')
  const [cap, setCap] = useState('0')
  const [loadingRate, setLoadingRate] = useState(false)
  const [loadingCap, setLoadingCap] = useState(false)
  const loading = loadingRate || loadingCap

  useEffect(() => {
    const fetchRate = async () => {
      setLoadingRate(true)
      const { data } = await fcd.get<Response>('/treasury/tax_rate')
      const { result } = data
      setRate(result)
      setLoadingRate(false)
    }

    fetchRate()
  }, [])

  useEffect(() => {
    const fetchCap = async () => {
      setLoadingCap(true)
      const { data } = await fcd.get<Response>(`/treasury/tax_cap/${denom}`)
      const { result } = data
      setCap(result)
      setLoadingCap(false)
    }

    const noTax = denom === 'uluna' || is.address(denom)

    if (denom) {
      !noTax ? fetchCap() : setCap('0')
    }
  }, [denom])

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
    (amount: string) =>
      BigNumber.min(new BigNumber(amount).times(rate), new BigNumber(cap))
        .integerValue(BigNumber.ROUND_CEIL)
        .toString(),
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
