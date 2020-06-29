import React from 'react'
import { WithdrawProps } from '@terra-money/use-station'
import { useWithdraw, useAuth } from '@terra-money/use-station'
import Post from './Post'

const Withdraw = ({ amounts, from }: WithdrawProps) => {
  const { user } = useAuth()
  const response = useWithdraw(user!, { amounts, from })
  return <Post post={response} />
}

export default Withdraw
