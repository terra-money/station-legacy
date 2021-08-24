import { useState, useEffect, useCallback } from 'react'
import { CurrencyConfig, Currency, Rate, API } from '../types'
import useFCD from '../api/useFCD'

const format = (denom: string): string => denom.slice(1).toUpperCase()
const DefaultCurrency = { key: 'ukrw', value: format('ukrw'), krwRate: '1' }

export default (initial?: string): CurrencyConfig => {
  const { loading, data } = useRateKRT()
  const [current, setCurrent] = useState<Currency | undefined>()

  const list = Array.isArray(data)
    ? [DefaultCurrency].concat(
        data.filter(({ denom }) => denom !== 'uluna').map(convert)
      )
    : [DefaultCurrency]

  const set = useCallback(
    (key: string) => {
      const item = list?.find((item) => item.key === key) ?? DefaultCurrency
      setCurrent(item)
    },
    // eslint-disable-next-line
    [loading]
  )

  useEffect(() => {
    set(initial ?? 'uusd')
  }, [initial, set])

  return { current, list, loading, set }
}

/* helper */
const useRateKRT = (): API<Rate[]> => {
  const url = '/v1/market/swaprate/ukrw'
  const response = useFCD<Rate[]>({ url })
  return response
}

const convert = ({ denom, swaprate }: Rate): Currency => ({
  key: denom,
  value: format(denom),
  krwRate: swaprate,
})
