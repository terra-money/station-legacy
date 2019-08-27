import { signWithPrivateKey } from '@lunie/cosmos-keys'
import { getStoredWallet } from '../utils/localStorage'
import ledger from './ledger'

export default async (submitType = '', { name, password }) => {
  if (submitType === 'local') {
    const wallet = getStoredWallet(name, password)
    return signMessage => {
      const signature = signWithPrivateKey(
        signMessage,
        Buffer.from(wallet.privateKey, 'hex')
      )

      return { signature, publicKey: Buffer.from(wallet.publicKey, 'hex') }
    }
  } else if (submitType === 'ledger') {
    return async signMessage => {
      const publicKey = await ledger.getPubKey()
      const signature = await ledger.sign(signMessage)

      return { signature, publicKey }
    }
  }
}
