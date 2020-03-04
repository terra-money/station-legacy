import React from 'react'
import { WithdrawProps } from '@terra-money/use-station'
import { useWithdraw, useAuth, useInfo } from '@terra-money/use-station'
import { useApp } from '../hooks'
import ProgressCircle from '../components/ProgressCircle'
import Confirm from '../components/Confirm'
import Confirmation from './Confirmation'

const Withdraw = ({ amounts, from }: WithdrawProps) => {
  const { modal } = useApp()
  const { user } = useAuth()
  const { ERROR } = useInfo()
  const { error, loading, confirm } = useWithdraw(user!, { amounts, from })

  return error ? (
    <Confirm {...ERROR} />
  ) : loading ? (
    <ProgressCircle center />
  ) : confirm ? (
    <Confirmation confirm={confirm} modal={modal} />
  ) : null
}

export default Withdraw
