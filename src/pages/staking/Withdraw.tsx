import React, { useState } from 'react'
import { useAuth } from '../../hooks'
import ModalContent from '../../components/ModalContent'
import Confirmation from '../Confirmation'

type Props = {
  from?: string
  amounts: Reward[]
  onWithdrawing: (b: boolean) => void
  onWithdraw: () => void
}

const Withdraw = (props: Props) => {
  const { from = '', amounts, onWithdrawing, onWithdraw } = props
  const { address: to } = useAuth()

  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false)

  const handleWithdrawing = (b: boolean) => {
    onWithdrawing(b)
    setIsWithdrawing(b)
  }

  return (
    <ModalContent close={onWithdraw} disabled={isWithdrawing}>
      <Confirmation
        url={`/distribution/delegators/${to}/rewards${from ? '/' + from : ''}`}
        amounts={amounts}
        label={['Withdraw', 'Withdrawing']}
        message={`Withdrew to ${to}`}
        onSubmitting={handleWithdrawing}
        onFinish={onWithdraw}
      />
    </ModalContent>
  )
}

export default Withdraw
