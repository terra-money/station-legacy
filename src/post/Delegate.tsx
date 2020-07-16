import React from 'react'
import { useAuth, useDelegate } from '@terra-money/use-station'
import Post from './Post'

interface Props {
  address: string
  isUndelegation: boolean
}

const Delegate = ({ address: validatorAddress, isUndelegation }: Props) => {
  const { user } = useAuth()
  const response = useDelegate(user!, { validatorAddress, isUndelegation })
  return <Post post={response} />
}

export default Delegate
