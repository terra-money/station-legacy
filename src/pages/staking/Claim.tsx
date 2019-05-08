import React, { useState } from 'react'
import ModalContent from '../../components/ModalContent'
import Confirmation from '../Confirmation'

type Props = Validator & {
  onClaiming: (b: boolean) => void
  onClaim: () => void
}

const Claim = ({ onClaiming, onClaim, ...v }: Props) => {
  const [isClaiming, setIsClaiming] = useState<boolean>(false)

  const handleClaiming = (b: boolean) => {
    onClaiming(b)
    setIsClaiming(b)
  }

  return (
    <ModalContent close={onClaim} disabled={isClaiming}>
      <Confirmation
        url={`distribution/validators/${v.operatorAddress}/rewards`}
        denom="uluna"
        label={['Claim', 'Claiming']}
        message={`Claimed to ${v.description.moniker}`}
        onSubmitting={handleClaiming}
        onFinish={onClaim}
      />
    </ModalContent>
  )
}

export default Claim
