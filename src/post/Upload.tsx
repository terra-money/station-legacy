import React from 'react'
import { useUpload, useAuth } from '@terra-money/use-station'
import Post from './Post'

const Upload = () => {
  const { user } = useAuth()
  const response = useUpload(user!)
  return <Post post={response} />
}

export default Upload
