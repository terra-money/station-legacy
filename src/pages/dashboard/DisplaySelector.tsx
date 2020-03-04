import React, { useState } from 'react'
import { DisplaySelector as Props } from '@terra-money/use-station'
import Card from '../../components/Card'
import Number from '../../components/Number'
import Select from '../../components/Select'

const DisplaySelector = (props: Props) => {
  const { title, defaultOption, options, displays } = props

  const [current, setCurrent] = useState<string>(defaultOption)

  const selector = (
    <Select
      onChange={e => setCurrent(e.target.value)}
      value={current}
      className="form-control form-control-md"
      width={80}
    >
      {options.map((label, index) => (
        <option value={label} key={index}>
          {label}
        </option>
      ))}
    </Select>
  )

  return (
    <Card title={title} footer={selector} small>
      <Number {...displays[current]} fontSize={20} integer />
    </Card>
  )
}

export default DisplaySelector
