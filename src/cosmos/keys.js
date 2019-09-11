import * as bech32 from 'bech32'
import * as secp256k1 from 'secp256k1'
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

export const signWithPrivateKey = (signMessage, privateKey) => {
  const signMessageString =
    typeof signMessage === 'string' ? signMessage : JSON.stringify(signMessage)
  const signHash = Buffer.from(
    CryptoJS.SHA256(signMessageString).toString(),
    `hex`
  )
  const { signature } = secp256k1.sign(signHash, privateKey)

  return signature
}
