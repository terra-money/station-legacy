import React from 'react'
import { useInfo } from '@terra-money/use-station'
import Info from './Info'
import ProgressCircle from './ProgressCircle'

const Loading = ({ card }: { card?: boolean }) => {
  const { LOADING } = useInfo()
  return <Info {...LOADING} icon={<ProgressCircle size={45} />} card={card} />
}

export default Loading
