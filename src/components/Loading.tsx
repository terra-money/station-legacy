import React from 'react'
import Info from './Info'
import ProgressCircle from './ProgressCircle'

const Loading = () => (
  <Info icon={<ProgressCircle size={45} />} title="Data is loading…">
    Please wait a moment.
  </Info>
)

export default Loading
