import React from 'react'
import { usePropose, useAuth } from '@terra-money/use-station'
import Post from './Post'

const Propose = () => {
  const { user } = useAuth()
  const response = usePropose(user!)
  return <Post post={response} />
}

export default Propose
