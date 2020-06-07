export const createBroadcastBody = (signedTx, returnType = 'sync') =>
  JSON.stringify({ tx: signedTx, mode: returnType })

export const createSignedTransactionObject = (tx, signature) =>
  Object.assign({}, tx, { signatures: [signature] })
