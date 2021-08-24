import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PricePage, PriceUI, PriceData, Price, Point } from '../../types'
import { useConfig } from '../../contexts/ConfigContext'
import { format, percent } from '../../utils'
import useFCD from '../../api/useFCD'
import usePoll, { MINUTE, HOUR, DAY } from './usePoll'

const intervals = [
  { interval: MINUTE * 1, label: '1m' },
  { interval: MINUTE * 5, label: '5m' },
  { interval: MINUTE * 15, label: '15m' },
  { interval: MINUTE * 30, label: '30m' },
  { interval: HOUR * 1, label: '1h' },
  { interval: DAY * 1, label: '1d' },
]

export default (): PricePage => {
  const { t } = useTranslation()
  const { currency } = useConfig()
  const denom = currency.current?.key

  /* filter */
  const [intervalIndex, setIntervalIndex] = useState(2) // intervals[2] === 15m
  const { label } = intervals[intervalIndex]

  const filter = {
    interval: {
      value: String(intervalIndex),
      set: (value: string) => setIntervalIndex(Number(value)),
      options: intervals.map(({ label }, index) => ({
        value: String(index),
        children: t('Page:Swap:' + label),
      })),
    },
  }

  /* api */
  const url = '/v1/market/price'
  const params = { denom, interval: label }
  const response = useFCD<PriceData>({ url, params }, false)

  /* polling */
  const { interval } = intervals[Number(filter.interval.value)]
  usePoll(response.execute, interval)

  /* render */
  const render = (data: PriceData, denom: string): PriceUI => {
    const { lastPrice: price = 0, prices = [], ...rest } = data

    return {
      price,
      unit: format.denom(denom),
      variation: {
        amount: format.decimalN(rest.oneDayVariation),
        value: format.decimal(rest.oneDayVariation),
        percent: percent(rest.oneDayVariationRate),
      },
      chart: prices.length
        ? { data: prices.map(getPoint) }
        : { message: t('Page:Swap:Chart is not available') },
    }
  }

  return Object.assign(
    { title: t('Page:Swap:Luna price'), filter },
    response,
    response.data && denom && { ui: render(response.data, denom) }
  )
}

/* helper */
const getPoint = ({ datetime, price }: Partial<Price>): Point => ({
  t: datetime ? new Date(datetime) : new Date(),
  y: format.decimalN(String(price)),
})
