import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { plus, sum, isFinite } from '../../api/math'
import Chart from '../../components/Chart'
import Amount from '../../components/Amount'
import s from './StakingChart.module.scss'

type Props = {
  list: StakingDelegation[]
  currentTab: Tab
  renderTabs: () => ReactNode
}

const StakingChart = ({ list, currentTab, renderTabs }: Props) => {
  const { label, key } = currentTab

  const { t } = useTranslation()

  const getLabel = (d: StakingDelegation) => d.validatorName
  const getLabels = () =>
    list.length <= 5
      ? list.map(getLabel)
      : [...list.slice(0, 4).map(getLabel), 'Others']

  const getDatum = (d: StakingDelegation) => parse(d[key])
  const getData = () => {
    const sumOthers = () => {
      const sum = list.slice(4).reduce((total, d) => plus(total, d[key]), '0')
      return parse(sum)
    }

    return list.length <= 5
      ? list.map(getDatum)
      : [...list.slice(0, 4).map(getDatum), sumOthers()]
  }

  const getSum = (): string => {
    const src = list.map(d => d[key]).filter(isFinite)
    return src.length ? sum(src) : '0'
  }

  return (
    <>
      <div style={{ width: 240, height: 240 }} className={s.chart}>
        <Chart
          type="doughnut"
          labels={getLabels()}
          data={getData()}
          width={240}
          height={240}
        />
        <section className={s.total}>
          <h1>{t(label)}</h1>
          <Amount fontSize={20}>{getSum()}</Amount>
        </section>
      </div>

      <section className={s.tabs}>{renderTabs()}</section>
    </>
  )
}

export default StakingChart

/* helpers */
const parse = (n: BigNumber.Value): number =>
  new BigNumber(n || 0)
    .div(1e6)
    .decimalPlaces(6, BigNumber.ROUND_DOWN)
    .toNumber()
