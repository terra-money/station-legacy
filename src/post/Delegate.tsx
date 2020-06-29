import React from 'react'
import { useAuth, useDelegate } from '@terra-money/use-station'
import Post from './Post'

interface Props {
  to: string
  undelegate: boolean
}

const Delegate = ({ to, undelegate }: Props) => {
  const { user } = useAuth()
  const response = useDelegate(user!, { to, undelegate })
  return <Post post={response} />
}

export default Delegate
