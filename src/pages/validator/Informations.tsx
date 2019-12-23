import React from 'react'
import { useTranslation } from 'react-i18next'
import { percent } from '../../api/math'
import { format } from '../../utils'
import Finder from '../../components/Finder'
import s from './Informations.module.scss'

const Informations = (v: Validator) => {
  const { t } = useTranslation()

  /* render */
  const list = [
    {
      label: t('Operator address'),
      value: v.operatorAddress
    },
    {
      label: t('Account address'),
      value: <Finder q="account">{v.accountAddress}</Finder>
    },
    {
      label: t('Max commission rate'),
      value: percent(v.commissionInfo.maxRate)
    },
    {
      label: t('Max daily commission change'),
      value: percent(v.commissionInfo.maxChangeRate)
    },
    {
      label: t('Delegation return'),
      value: percent(v.stakingReturn)
    },
    {
      label: t('Last commission change'),
      value: format.date(v.commissionInfo.updateTime)
    }
  ]

  return (
    <ul className={s.list}>
      {list.map(({ label, value }) => (
        <li key={label}>
          <h1>{label}</h1>
          <p>{value}</p>
        </li>
      ))}
    </ul>
  )
}

export default Informations
