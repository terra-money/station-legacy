import React from 'react'
import Card from '../components/Card'
import Info from '../components/Info'

const NotFound = () => (
  <Card>
    <Info
      icon="sentiment_very_dissatisfied"
      title="Oops! Something went wrong."
    >
      You have encounteted an error.
    </Info>
  </Card>
)

export default NotFound
