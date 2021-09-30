import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import BigNumber from 'bignumber.js'
import { CoinItem } from '../lib'
import useLCD from '../api/useLCD'
import { localSettings } from '../utils/localStorage'

const currencyState = atom({
  key: 'currencyState',
  default: localSettings.get().currency ?? 'uusd',
})

export const useCurrency = () => {
  return useRecoilValue(currencyState)
}

export const useSetCurrency = () => {
  const setCurrency = useSetRecoilState(currencyState)
  return (currency: string) => {
    localSettings.set({ currency })
    setCurrency(currency)
  }
}

export const useCurrencyRates = () => {
  const currency = useCurrency()
  const setCurrency = useSetCurrency()
  const lcd = useLCD()

  const { data = {}, isLoading } = useQuery<Dictionary<string>>(
    'exchangeRates',
    async () => {
      const coins = await lcd.oracle.exchangeRates()
      const rates = coins
        .toData()
        .reduce((acc, { amount, denom }) => ({ ...acc, [denom]: amount }), {})

      return { ...rates, uluna: '1' }
    },
    { staleTime: Infinity }
  )

  const getRate = (currency: string, base: string) => {
    return new BigNumber(data[currency]).div(data[base]).toString()
  }

  const getValue = ({ denom, amount }: CoinItem, base: string) => {
    const rate = getRate(denom, base)
    return new BigNumber(amount).div(rate).toString()
  }

  const getCurrentCurrencyValue = (item: CoinItem) => {
    return getValue(item, currency)
  }

  // On init
  useEffect(() => {
    !isLoading && !data[currency] && setCurrency('uusd')
  }, [currency, data, isLoading, setCurrency])

  return { list: data, getRate, getValue, getCurrentCurrencyValue }
}
