import React from 'react'
import { useSignInWithLedger } from '@terra-money/use-station'
import ledger from '../cosmos/ledger'
import ModalContent from '../components/ModalContent'
import { useAuthModal } from './useAuthModal'
import ConfirmLedger from './ConfirmLedger'

const SignInWithLedger = () => {
  const modal = useAuthModal()
  const confirm = useSignInWithLedger(
    async () => await ledger.getTerraAddress()
  )

  return (
    <ModalContent {...modal}>
      <ConfirmLedger {...confirm} />
    </ModalContent>
  )
}

export default SignInWithLedger
