import React from 'react'
import { TaxRateUI } from '@terra-money/use-station'
import Card from '../../components/Card'
import Badge from '../../components/Badge'

const TaxRate = ({ title, content, desc }: TaxRateUI) => {
  const badge = (
    <Badge small light>
      {desc}
    </Badge>
  )

  return (
    <Card title={title} footer={badge} small>
      <span style={{ fontSize: 20 }}>{content}</span>
    </Card>
  )
}

export default TaxRate
