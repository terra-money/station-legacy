import { useCallback, useEffect, useState } from 'react'
import { Dictionary } from 'ramda'
import BigNumber from 'bignumber.js'
import { TFunction } from 'i18next'
import { Result } from '../types'
import fcd from '../api/fcd'

type Response = Result<string>
const useCalcTaxes = (denoms: string[], t: TFunction) => {
  const [rate, setRate] = useState('0')
  const [caps, setCaps] = useState<Dictionary<string>>({})
  const [loadingRate, setLoadingRate] = useState(false)
  const [loadingCaps, setLoadingCaps] = useState(false)
  const loading = loadingRate || loadingCaps

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
      setLoadingCaps(true)
      const queries = denoms.map((denom) =>
        fcd.get<Response>(`/treasury/tax_cap/${denom}`)
      )

      const responses = await Promise.all(queries)
      const caps = denoms.reduce(
        (acc, denom, index) => ({
          ...acc,
          [denom]: responses[index].data.result,
        }),
        {}
      )

      setCaps(caps)
      setLoadingCaps(false)
    }

    fetchCap()

    // eslint-disable-next-line
  }, [JSON.stringify(denoms)])

  const getTax = useCallback(
    (amount: string, denom: string) =>
      BigNumber.min(
        new BigNumber(amount).times(rate),
        new BigNumber(caps[denom])
      )
        .integerValue(BigNumber.ROUND_CEIL)
        .toString(),
    [caps, rate]
  )

  return { loading, getTax }
}

export default useCalcTaxes
