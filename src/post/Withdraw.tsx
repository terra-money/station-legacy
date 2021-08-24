import React from 'react'
import { WithdrawProps } from '../lib'
import { useWithdraw, useAuth } from '../lib'
import Post from './Post'

const Withdraw = (props: WithdrawProps) => {
  const { user } = useAuth()
  const response = useWithdraw(user!, props)
  return <Post post={response} />
}

export default Withdraw
