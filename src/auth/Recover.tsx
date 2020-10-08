import React, { useState } from 'react'
import { SignUpNext, Seed, Address, Wallet } from '@terra-money/use-station'
import { useSignUp } from '@terra-money/use-station'
import { electron } from '../utils'
import { importKey, loadKeys, storeKeys } from '../utils/localStorage'
import Form from '../components/Form'
import ModalContent from '../components/ModalContent'
import ErrorComponent from '../components/ErrorComponent'
import { useAuthModal } from './useAuthModal'
import Warning from './Warning'
import Mnemonics from './Mnemonics'
import SelectAccount from './SelectAccount'
import ConfirmSeed from './ConfirmSeed'

const Recover = ({ generated }: { generated?: Seed }) => {
  const modal = useAuthModal()
  const { form, mnemonics, warning, next, reset, error } = useSignUp({
    generated,
    generateAddresses: async (phrase: string) =>
      await electron<Promise<[Address, Address]>>('generateAddresses', phrase),
    generateWallet: async (phrase, bip) => {
      const params = [phrase, bip]
      const wallet = await electron<Wallet>('generateWalletFromSeed', params)
      return wallet
    },
    submit: async (params) => {
      const keys = loadKeys()
      const exists = findExistsIndex('address', params.wallet.terraAddress)
      exists > -1 && storeKeys(keys.filter((_, i) => i !== exists))
      await importKey(params)
    },
    isNameExists: (name: string) => findExistsIndex('name', name) > -1,
  })

  /* warning */
  const [checked, setChecked] = useState(false)
  const toggle = () => setChecked((c) => !c)

  /* render */
  const renderNext = (next: SignUpNext) => {
    const components = {
      select: () => <SelectAccount {...next} />,
      confirm: () => <ConfirmSeed {...next} />,
    }

    return components[next.step]()
  }

  return (
    <ModalContent {...Object.assign({}, modal, reset && { goBack: reset })}>
      {error ? (
        <ErrorComponent>{error.message}</ErrorComponent>
      ) : next ? (
        renderNext(next)
      ) : (
        <Form form={form} disabled={generated && !checked}>
          {generated ? (
            <Warning {...warning} attrs={{ checked, onChange: toggle }} />
          ) : (
            <Mnemonics {...mnemonics} />
          )}
        </Form>
      )}
    </ModalContent>
  )
}

export default Recover

/* helper */
const findExistsIndex = (q: keyof Key, v: string): number => {
  const keys = loadKeys()
  return keys.findIndex((key) => key[q] === v)
}
