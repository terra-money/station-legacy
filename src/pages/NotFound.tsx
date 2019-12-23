import React from 'react'
import { OOPS } from '../helpers/constants'
import Card from '../components/Card'
import Info from '../components/Info'

const NotFound = () => (
  <Card>
    <Info icon="sentiment_very_dissatisfied" title={OOPS}>
      You have encounteted an error.
    </Info>
  </Card>
)

export default NotFound
