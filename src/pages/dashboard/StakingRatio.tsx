import React from 'react'
import { StakingRatioUI } from '@terra-money/use-station'
import Card from '../../components/Card'
import Badge from '../../components/Badge'

const StakingRatio = ({ title, content, small, desc }: StakingRatioUI) => {
  const badge = (
    <Badge small light>
      {desc}
    </Badge>
  )

  return (
    <Card title={title} footer={badge} small>
      <p style={{ fontSize: 20 }}>{content}</p>
      <small>({small})</small>
    </Card>
  )
}

export default StakingRatio
