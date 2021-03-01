import { Key, PublicKey, StdSignMsg, StdSignature } from '@terra-money/terra.js'
import * as ledger from '../wallet/ledger'

class LedgerKey extends Key {
  public sign(): Promise<Buffer> {
    throw new Error(
      'LedgerKey does not use sign() -- use createSignature() directly.'
    )
  }

  public async createSignature(tx: StdSignMsg): Promise<StdSignature> {
    const pubkeyBuffer = await ledger.getPubKey()

    if (!pubkeyBuffer) {
      throw new Error('failed getting public key from ledger')
    }

    const signatureBuffer = await ledger.sign(tx.toJSON())

    if (!signatureBuffer) {
      throw new Error('failed signing from ledger')
    }

    return new StdSignature(
      signatureBuffer.toString('base64'),
      PublicKey.fromData({
        type: 'tendermint/PubKeySecp256k1',
        value: pubkeyBuffer.toString('base64'),
      })
    )
  }
}

export default LedgerKey
