import React from 'react'
import { usePropose, useAuth } from '../use-station/src'
import Post from './Post'

const Propose = () => {
  const { user } = useAuth()
  const response = usePropose(user!)
  return <Post post={response} />
}

export default Propose
