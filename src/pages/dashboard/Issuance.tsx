import React, { useState } from 'react'
import c from 'classnames'
import { format } from '../../utils'
import Card from '../../components/Card'
import Amount from '../../components/Amount'

interface Props {
  issuances: Issuances
}

const Issuance = ({ issuances }: Props) => {
  const [current, setCurrent] = useState<string>(Object.keys(issuances)[0])
  return (
    <Card
      title="Issuance"
      footer={Object.keys(issuances).map((label, index) => (
        <button
          className={c(
            'badge badge-small',
            label === current && 'badge-primary'
          )}
          onClick={() => setCurrent(label)}
          style={{ margin: 0 }}
          key={index}
        >
          {format.denom(label)}
        </button>
      ))}
      small
    >
      <Amount denom={current} fontSize={20} hideDecimal>
        {issuances[current]}
      </Amount>
    </Card>
  )
}

export default Issuance
