import React from 'react'
import { percent } from '../../api/math'

const Tallying = ({ quorum, threshold, veto }: TallyingParameters) => {
  const contents = [
    ['Quorum', quorum],
    ['Pass Threshold', threshold],
    ['Veto Threshold', veto]
  ]

  const renderContent = ([title, value]: string[]) => (
    <article key={title}>
      <h1>{title}</h1>
      <p>{percent(value)}</p>
    </article>
  )

  return <>{contents.map(renderContent)}</>
}

export default Tallying
