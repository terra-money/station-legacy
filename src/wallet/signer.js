import { getStoredWallet, decryptWallet } from '../utils/localStorage'
import { signWithPrivateKey } from './keys'
import * as ledger from './ledger'

export default async (submitType = '', { name, password } = {}, wallet) => {
  if (submitType === 'local') {
    const { privateKey, publicKey } = wallet
      ? decryptWallet(wallet, password)
      : getStoredWallet(name, password)

    return (signMessage) => {
      const signature = signWithPrivateKey(
        signMessage,
        Buffer.from(privateKey, 'hex')
      )

      return { signature, publicKey: Buffer.from(publicKey, 'hex') }
    }
  } else if (submitType === 'ledger') {
    return async (signMessage) => {
      const publicKey = await ledger.getPubKey()
      const signature = await ledger.sign(signMessage)

      return { signature, publicKey }
    }
  }
}
