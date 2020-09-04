import { mergeRight as merge, omit } from 'ramda'
import { Wallet } from '@terra-money/use-station'
import { encrypt, decrypt } from './terra-keystore'

/* keys */
export const loadKeys = (): Key[] =>
  JSON.parse(localStorage?.getItem('keys') ?? '[]')

export const storeKeys = (keys: Key[]) => {
  localStorage?.setItem('keys', JSON.stringify(keys))
}

export const decryptWallet = (wallet: string, password: string) => {
  try {
    const decrypted = decrypt(wallet, password)
    return JSON.parse(decrypted)
  } catch (err) {
    throw new Error('Incorrect password')
  }
}

export const getStoredWallet = (name: string, password: string): Wallet => {
  const keys = loadKeys()
  const stored = keys.find((key) => key.name === name)

  if (!stored) throw new Error('Key with that name does not exist')
  return decryptWallet(stored.wallet, password)
}

type Params = { name: string; password: string; wallet: Wallet }

export const encryptWallet = ({ name, password, wallet }: Params): Key => {
  const encrypted = encrypt(JSON.stringify(wallet), password)

  if (!encrypted) throw new Error('Encryption error occurred')

  return {
    name,
    address: wallet.terraAddress,
    wallet: encrypted,
  }
}

export const importKey = async (params: Params) => {
  const keys = loadKeys()

  if (keys.find((key) => key.name === params.name))
    throw new Error('Key with that name already exists')

  const key = encryptWallet(params)

  storeKeys([...keys, key])
}

export const findName = (address: string): string | undefined => {
  const keys = loadKeys()
  const key = keys.find((key) => key.address === address)
  return key ? key.name : undefined
}

export const testPassword = (name: string, password: string) => {
  const keys = loadKeys()
  const key = keys.find((key) => key.name === name)

  if (!key) throw new Error('Key with that name does not exist')

  try {
    const decrypted = decrypt(key.wallet, password)
    JSON.parse(decrypted)
    return true
  } catch (error) {
    return false
  }
}

/* Settings */
const SETTINGS = 'settings'

const getSettings = (): Settings => {
  const settings = localStorage?.getItem(SETTINGS)
  return settings ? JSON.parse(settings) : {}
}

const setSettings = (next: Partial<Settings>): void => {
  const settings = getSettings()
  localStorage?.setItem(SETTINGS, JSON.stringify(merge(settings, next)))
}

const deleteSettings = (keys: (keyof Settings)[]): void => {
  const settings = getSettings()
  localStorage?.setItem(SETTINGS, JSON.stringify(omit(keys, settings)))
}

export const localSettings = {
  get: getSettings,
  set: setSettings,
  delete: deleteSettings,
}
