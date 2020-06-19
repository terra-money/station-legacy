import React from 'react'
import { ValidatorUI } from '@terra-money/use-station'
import Card from '../../components/Card'
import ExtLink from '../../components/ExtLink'
import s from './Informations.module.scss'

const Informations = (v: ValidatorUI) => {
  const { accountAddress, operatorAddress } = v
  const { maxRate, maxChangeRate, delegationReturn, updateTime } = v

  const link = (
    <ExtLink href={accountAddress.link}>{accountAddress.address}</ExtLink>
  )

  const list = [
    { label: operatorAddress.title, value: operatorAddress.address },
    { label: accountAddress.title, value: link },
    { label: maxRate.title, value: maxRate.percent },
    { label: maxChangeRate.title, value: maxChangeRate.percent },
    { label: delegationReturn.title, value: delegationReturn.percent },
    { label: updateTime.title, value: updateTime.date },
  ]

  return (
    <Card>
      <ul className={s.list}>
        {list.map(({ label, value }) => (
          <li key={label}>
            <h1>{label}</h1>
            <p>{value}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default Informations
