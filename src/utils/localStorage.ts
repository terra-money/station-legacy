import { mergeRight as merge, omit } from 'ramda'
import { Wallet } from '@terra-money/use-station'
import electron from './electron'

/* keys */
export const loadKeys = (): Key[] =>
  JSON.parse(localStorage.getItem('keys') || '[]')

export const storeKeys = (keys: Key[]) => {
  localStorage.setItem('keys', JSON.stringify(keys))
}

export const getStoredWallet = (name: string, password: string): Wallet => {
  const keys = loadKeys()
  const stored = keys.find(key => key.name === name)

  if (!stored) throw new Error('Key with that name does not exist')

  try {
    const decrypted = electron<string>('decrypt', [stored.wallet, password])
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

export const findName = (address: string): string | undefined => {
  const keys = loadKeys()
  const key = keys.find(key => key.address === address)
  return key ? key.name : undefined
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

/* Settings */
const SETTINGS = 'settings'

const getSettings = (): Settings => {
  const settings = localStorage.getItem(SETTINGS)
  return settings ? JSON.parse(settings) : {}
}

const setSettings = (next: Partial<Settings>): void => {
  const settings = getSettings()
  localStorage.setItem(SETTINGS, JSON.stringify(merge(settings, next)))
}

const deleteSettings = (keys: (keyof Settings)[]): void => {
  const settings = getSettings()
  localStorage.setItem(SETTINGS, JSON.stringify(omit(keys, settings)))
}

export const localSettings = {
  get: getSettings,
  set: setSettings,
  delete: deleteSettings
}
