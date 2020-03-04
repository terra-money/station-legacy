import React from 'react'
import { useRate, RateItem, RateUI } from '@terra-money/use-station'
import c from 'classnames'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Card from '../../components/Card'
import Select from '../../components/Select'
import NotAvailable from '../../components/NotAvailable'
import Variation from './Variation'
import s from './RateList.module.scss'

const RateList = ({ denoms }: { denoms: string[] }) => {
  const { error, loading, title, message, unit, filter, ui } = useRate(denoms)

  const renderFilter = () => {
    const { value, set, options } = filter.denom
    return (
      <Select
        value={value}
        onChange={e => set(e.target.value)}
        className={c('form-control', s.select)}
      >
        {options.map((attrs, index) => (
          <option {...attrs} key={index} />
        ))}
      </Select>
    )
  }

  const renderRow = ({ display, variation }: RateItem, index: number) => (
    <li className={s.row} key={index}>
      <header>
        <span className={s.unit}>1 {unit} =</span>
        <p className={s.price}>
          {display.value} <strong>{display.unit}</strong>
        </p>
      </header>
      <section>
        <Variation variation={variation} />
      </section>
    </li>
  )

  const render = ({ message, list }: RateUI) =>
    message ? (
      <NotAvailable>{message}</NotAvailable>
    ) : (
      <ul>{list?.map(renderRow)}</ul>
    )

  return (
    <Card title={title} fixedHeight>
      {message ? <NotAvailable>{message}</NotAvailable> : renderFilter()}
      {error ? <ErrorComponent /> : loading ? <Loading /> : ui && render(ui)}
    </Card>
  )
}

export default RateList
