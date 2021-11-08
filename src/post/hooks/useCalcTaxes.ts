import { useCallback, useEffect, useState } from 'react'
import { Dictionary } from 'ramda'
import BigNumber from 'bignumber.js'
import { TFunction } from 'i18next'
import useLCD from '../../api/useLCD'

const useCalcTaxes = (denoms: string[], t: TFunction) => {
  const lcd = useLCD()
  const [rate, setRate] = useState('0')
  const [caps, setCaps] = useState<Dictionary<string>>({})
  const [loadingRate, setLoadingRate] = useState(false)
  const [loadingCaps, setLoadingCaps] = useState(false)
  const loading = loadingRate || loadingCaps

  useEffect(() => {
    const fetchRate = async () => {
      setLoadingRate(true)
      const rate = await lcd.treasury.taxRate()
      setRate(rate.toString())
      setLoadingRate(false)
    }

    fetchRate()
  }, [lcd])

  useEffect(() => {
    const fetchCap = async () => {
      setLoadingCaps(true)
      const queries = denoms.map((denom) => lcd.treasury.taxCap(denom))
      const responses = await Promise.all(queries)
      const caps = denoms.reduce(
        (acc, denom, index) => ({
          ...acc,
          [denom]: responses[index].amount.toString(),
        }),
        {}
      )

      setCaps(caps)
      setLoadingCaps(false)
    }

    fetchCap()

    // eslint-disable-next-line
  }, [JSON.stringify(denoms), lcd])

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
