import React from 'react'
import { Filter, Point } from '@terra-money/use-station'
import { Variation as VariationProps, PriceUI } from '@terra-money/use-station'
import { usePrice, format } from '@terra-money/use-station'
import c from 'classnames'
import { helpers } from 'chart.js'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Chart from '../../components/Chart'
import Card from '../../components/Card'
import Select from '../../components/Select'
import Number from '../../components/Number'
import Variation from './Variation'
import NotAvailable from '../../components/NotAvailable'
import s from './Price.module.scss'

const Price = ({ actives }: { actives: string[] }) => {
  const { error, loading, title, filter, ui } = usePrice(actives)

  const renderActions = () => {
    const { denom, interval } = filter

    return (
      <>
        {denom && renderFilter(denom)}
        {interval && renderFilter(interval)}
      </>
    )
  }

  const renderFilter = ({ value, set, options }: Filter) =>
    !!options.length && (
      <Select
        value={value}
        onChange={e => set(e.target.value)}
        className={c('form-control form-control-md', s.select)}
      >
        {options.map((option, index) => (
          <option {...option} key={index} />
        ))}
      </Select>
    )

  type Header = { price: number; variation: VariationProps }
  const renderHeader = ({ price, variation }: Header) => (
    <header className={s.header}>
      <Number fontSize={24}>{format.decimal(String(price))}</Number>
      <Variation variation={variation} showPercent />
    </header>
  )

  const renderGraph = (data: Point[]) => {
    const lineStyle = {
      backgroundColor: helpers
        .color('#e4e8f6')
        .alpha(0.5)
        .rgbString()
    }

    return (
      <>
        <section style={{ height: 260 }}>
          <Chart type="line" data={data} lineStyle={lineStyle} height={260} />
        </section>
      </>
    )
  }

  const render = (ui: PriceUI) => {
    const { data, message } = ui.chart
    return (
      <>
        {renderHeader(ui)}

        {message ? (
          <NotAvailable>{message}</NotAvailable>
        ) : (
          data && renderGraph(data)
        )}
      </>
    )
  }

  return (
    <Card
      title={title}
      actions={renderActions()}
      bodyClassName={c(ui?.price && s.body)}
    >
      {error ? <ErrorComponent /> : ui ? render(ui) : loading && <Loading />}
    </Card>
  )
}

export default Price
