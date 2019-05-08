import { without } from 'ramda'
import electron from '../helpers/electron'

/* keys */
type Key = { name: string; address: string; wallet: string }
export const loadKeys = (): Key[] =>
  JSON.parse(localStorage.getItem('keys') || '[]')

export const storeKeys = (keys: Key[]) => {
  localStorage.setItem('keys', JSON.stringify(keys))
}

export const getKey = (name: string, password: string): Wallet => {
  const keys = loadKeys()
  const key = keys.find(key => key.name === name)
  if (!key) throw new Error('Key with that name does not exist')

  try {
    const decrypted = electron<string>('decrypt', [key.wallet, password])
    return JSON.parse(decrypted)
  } catch (err) {
    throw new Error('Incorrect password')
  }
}

type Params = { name: string; password: string; wallet: Wallet }
export const importKey = async ({ name, password, wallet }: Params) => {
  const keys = loadKeys()
  if (keys.find(key => key.name === name))
    throw new Error('Key with that name already exists')

  const encrypted = electron<string>('encrypt', [
    JSON.stringify(wallet),
    password
  ])

  if (!encrypted) throw new Error('Encryption error occurred')

  const key: Key = {
    name,
    address: wallet.terraAddress,
    wallet: encrypted
  }

  storeKeys([...keys, key])
}

export const findName = (address: string): string | null => {
  const keys = loadKeys()
  const key = keys.find(key => key.address === address)
  return key ? key.name : null
}

export const testPassword = (name: string, password: string) => {
  const keys = loadKeys()
  const key = keys.find(key => key.name === name)
  if (!key) throw new Error('Key with that name does not exist')

  try {
    const decrypted = electron<string>('decrypt', [key.wallet, password])
    JSON.parse(decrypted)
    return true
  } catch (error) {
    return false
  }
}

/* Recent */
export const getRecent = (): string[] =>
  JSON.parse(localStorage.getItem('recent') || '[]')

export const prependRecent = (address: string) => {
  const next = [address, ...without([address], getRecent())]
  localStorage.setItem('recent', JSON.stringify(next))
}

export const clearRecent = () => {
  localStorage.removeItem('recent')
}

/* Last address */
export const getLastAddress = () => localStorage.getItem('lastAddress')

export const setLastAddress = (address: string) => {
  localStorage.setItem('lastAddress', address)
}

export const removeLastAddress = () => {
  localStorage.removeItem('lastAddress')
}

/* Chain */
export const getLastChain = () => localStorage.getItem('lastChain')

export const setLastChain = (chain: string) => {
  localStorage.setItem('lastChain', chain)
}

export const removeLastChain = () => {
  localStorage.removeItem('lastChain')
}
