import React from 'react'
import { useAuth, useDelegate } from '../lib'
import { DelegateType } from '../lib/post/useDelegate'
import Post from './Post'

interface Props {
  address: string
  type: DelegateType
}

const Delegate = ({ address: validatorAddress, type }: Props) => {
  const { user } = useAuth()
  const response = useDelegate(user!, { validatorAddress, type })
  return <Post post={response} />
}

export default Delegate
