import React from 'react'
import { useHistory } from 'react-router-dom'
import { PricesUI } from '@terra-money/use-station'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Number from '../../components/Number'

const Prices = ({ title, display }: PricesUI) => {
  const history = useHistory()

  const badge = (
    <Badge small active>
      {display?.unit}
    </Badge>
  )

  const onClick = () => history.push('/swap')

  return (
    <Card title={title} footer={badge} onClick={onClick} small>
      <Number {...display} fontSize={20} />
    </Card>
  )
}

export default Prices
