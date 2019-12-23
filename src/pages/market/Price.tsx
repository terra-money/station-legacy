import React, { useState, useEffect, ChangeEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import BigNumber from 'bignumber.js'
import { ChartPoint, helpers } from 'chart.js'
import { OOPS } from '../../helpers/constants'
import api from '../../api/api'
import { times } from '../../api/math'
import { format } from '../../utils'
import Chart from '../../components/Chart'
import Card from '../../components/Card'
import Select from '../../components/Select'
import Amount from '../../components/Amount'
import variation from './Variation'
import NotAvailable from './NotAvailable'
import s from './Price.module.scss'

type Price = {
  lastPrice: number
  prices: { denom: string; datetime: number; price: number }[]
} & Variation

const intervals = ['1m', '5m', '15m', '30m', '1h', '1d']
const Price = ({ actives }: { actives: string[] }) => {
  const { t } = useTranslation()

  /* request */
  const [params, setParams] = useState({ denom: 'ukrw', interval: '15m' })
  const { denom, interval } = params
  const handleChange = (e: ChangeEvent<HTMLFieldElement>) =>
    setParams({ ...params, [e.target.name]: e.target.value })

  /* graph */
  const [price, setPrice] = useState<Price>()
  const [idle, setIdle] = useState<boolean>(true)
  const [error, setError] = useState<Error>()
  const { lastPrice = 0, prices = [] } = price || {}

  /* Fetch data */
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const params = { denom, interval }
        const { data } = await api.get<Price>('/v1/market/price', { params })
        setPrice(data)
        setIdle(false)
      } catch (error) {
        setError(error)
        setIdle(false)
      }
    }

    fetchPrices()
  }, [denom, interval])

  /* render */
  const renderVariation = ([h, t]: ReactNode[]): ReactNode => (
    <>
      {h}
      {t}
    </>
  )

  const renderActions = () => (
    <>
      {!!actives.length && (
        <Select
          name="denom"
          value={denom}
          onChange={handleChange}
          className={c('form-control form-control-md', s.select)}
        >
          {actives.map((denom, index) => (
            <option value={denom} key={index}>
              {format.denom(denom)}
            </option>
          ))}
        </Select>
      )}

      <Select
        name="interval"
        value={interval}
        onChange={handleChange}
        className={c('form-control form-control-md', s.select)}
      >
        {intervals.map(interval => (
          <option value={interval} key={interval}>
            {t(interval)}
          </option>
        ))}
      </Select>
    </>
  )

  const renderGraph = () => {
    const data: number[] | ChartPoint[] = prices.length
      ? prices.map(({ datetime, price }) => ({
          t: new Date(datetime),
          y: parse(price)
        }))
      : [lastPrice]

    const lineStyle = {
      backgroundColor: helpers
        .color('#e4e8f6')
        .alpha(0.5)
        .rgbString()
    }

    return (
      <>
        <header className={s.header}>
          <Amount fontSize={24}>{times(lastPrice, 1e6)}</Amount>
          {price &&
            variation({ ...price, inline: true, render: renderVariation })}
        </header>

        <section style={{ height: 260 }}>
          <Chart type="line" data={data} lineStyle={lineStyle} height={260} />
        </section>
      </>
    )
  }

  return (
    <Card
      title={t('Luna price')}
      actions={renderActions()}
      bodyClassName={c(!!lastPrice && s.body)}
    >
      {error
        ? OOPS
        : !idle &&
          (lastPrice ? (
            renderGraph()
          ) : (
            <NotAvailable>{t('Chart is not available.')}</NotAvailable>
          ))}
    </Card>
  )
}

export default Price

/* helpers */
const parse = (n: BigNumber.Value): number =>
  new BigNumber(n || 0).decimalPlaces(6, BigNumber.ROUND_DOWN).toNumber()
