import React, { useState } from 'react'
import { format } from '../../utils'
import Card from '../../components/Card'
import Amount from '../../components/Amount'
import Select from '../../components/Select'

interface Props {
  title: string
  issuances: CoinMap
}

const Issuance = ({ title, issuances = {} }: Props) => {
  const [current, setCurrent] = useState<string>('uluna')
  const options = Object.keys(issuances).map((label, index) => (
    <option value={label} key={index}>
      {format.denom(label)}
    </option>
  ))

  return (
    <Card
      title={title}
      footer={
        <Select
          onChange={e => setCurrent(e.target.value)}
          value={current}
          className="form-control form-control-md"
          width={80}
        >
          {options}
        </Select>
      }
      small
    >
      <Amount denom={current} fontSize={20} hideDecimal>
        {issuances[current]}
      </Amount>
    </Card>
  )
}

export default Issuance
