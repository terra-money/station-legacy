import { createSignedTransactionObject } from './send'
import { createSignMessage, createSignature } from './signature'

const createSignedTransaction = async (tx, signer, request) => {
  let signature, publicKey
  const { sequence, account_number, chain_id } = request
  const _req = { sequence, accountNumber: account_number, chainId: chain_id }
  const signMessage = createSignMessage(tx, _req)

  try {
    ;({ signature, publicKey } = await signer(signMessage))
  } catch (err) {
    throw new Error('Signing failed: ' + err.message)
  }

  const signatureObject = createSignature(
    signature,
    sequence,
    account_number,
    publicKey
  )

  return createSignedTransactionObject(tx, signatureObject)
}

export default async (tx, signer, request) => {
  const signedTx = await createSignedTransaction(tx, signer, request)
  return JSON.stringify(signedTx)
}
