import React from 'react'
import { WithdrawProps } from '../use-station/src'
import { useWithdraw, useAuth } from '../use-station/src'
import Post from './Post'

const Withdraw = (props: WithdrawProps) => {
  const { user } = useAuth()
  const response = useWithdraw(user!, props)
  return <Post post={response} />
}

export default Withdraw
