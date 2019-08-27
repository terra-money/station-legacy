import * as bech32 from 'bech32'
import * as CryptoJS from 'crypto-js'

export const getTerraAddress = publicKey => {
  const message = CryptoJS.enc.Hex.parse(publicKey.toString('hex'))
  const address = CryptoJS.RIPEMD160(CryptoJS.SHA256(message)).toString()
  return bech32ify(address, 'terra')
}

const bech32ify = (address, prefix) => {
  const words = bech32.toWords(Buffer.from(address, 'hex'))
  return bech32.encode(prefix, words)
}
