export const createSignMessage = (
  jsonTx,
  { sequence, accountNumber, chainId }
) => {
  const fee = {
    amount: jsonTx.fee.amount || [],
    gas: jsonTx.fee.gas
  }

  return JSON.stringify(
    removeEmptyProperties({
      fee,
      memo: jsonTx.memo,
      msgs: jsonTx.msg,
      sequence,
      account_number: accountNumber,
      chain_id: chainId
    })
  )
}

export const createSignature = (
  signature,
  sequence,
  accountNumber,
  publicKey
) => ({
  signature: signature.toString('base64'),
  account_number: accountNumber,
  sequence,
  pub_key: {
    type: 'tendermint/PubKeySecp256k1',
    value: publicKey.toString('base64')
  }
})

export const removeEmptyProperties = jsonTx => {
  if (Array.isArray(jsonTx)) {
    return jsonTx.map(removeEmptyProperties)
  }

  if (typeof jsonTx !== 'object') {
    return jsonTx
  }

  const sorted = {}
  Object.keys(jsonTx)
    .sort()
    .forEach(key => {
      if (jsonTx[key] === undefined || jsonTx[key] === null) return
      sorted[key] = removeEmptyProperties(jsonTx[key])
    })

  return sorted
}
