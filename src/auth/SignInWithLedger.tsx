import React from 'react'
import { useSignInWithLedger } from '../use-station/src'
import * as ledger from '../wallet/ledger'
import ConfirmLedger from './ConfirmLedger'

const SignInWithLedger = () => {
  const confirm = useSignInWithLedger(
    async () => await ledger.getTerraAddress()
  )

  return <ConfirmLedger {...confirm} />
}

export default SignInWithLedger
