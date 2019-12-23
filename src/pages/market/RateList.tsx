import React, { useState, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Card from '../../components/Card'
import Select from '../../components/Select'
import NotAvailable from './NotAvailable'
import variation from './Variation'
import s from './RateList.module.scss'

const RateList = ({ denoms }: { denoms: string[] }) => {
  const { t } = useTranslation()
  const [denom, setDenom] = useState(denoms[0])
  const handleChange = (e: ChangeEvent<HTMLFieldElement>) =>
    setDenom(e.target.value)

  const renderRow = (r: Rate & Variation, index: number) => (
    <li className={s.row} key={index}>
      <header>
        <span className={s.unit}>1 {format.denom(denom)} =</span>
        <p className={s.price}>
          {format.decimal(r.swaprate)} <strong>{format.denom(r.denom)}</strong>
        </p>
      </header>
      <section>{variation({ ...r, render: ([h]) => h })}</section>
    </li>
  )

  return (
    <Card title={t('Terra exchange rate')} fixedHeight>
      {!!denoms.length ? (
        <>
          <Select
            name="denom"
            value={denom}
            onChange={handleChange}
            className={c('form-control', s.select)}
          >
            {denoms.map((denom, index) => (
              <option value={denom} key={index}>
                {format.denom(denom)}
              </option>
            ))}
          </Select>

          <WithRequest url={`/v1/market/swaprate/${denom}`}>
            {(rateList: RateList) =>
              !!rateList.length ? (
                <ul>{rateList.map(renderRow)}</ul>
              ) : (
                <NotAvailable>{t('Swapping is not available.')}</NotAvailable>
              )
            }
          </WithRequest>
        </>
      ) : (
        <NotAvailable>{t('Swapping is not available.')}</NotAvailable>
      )}
    </Card>
  )
}

export default RateList
