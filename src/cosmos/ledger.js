import Transport from '@ledgerhq/hw-transport-webusb'
import Cosmos from 'ledger-cosmos-js'
import { signatureImport } from 'secp256k1'
import semver from 'semver'
import { getTerraAddress } from './keys'

const REQUIRED_APP_VERSION = '1.5.3'

const connect = async () => {
  const getAppName = async () => {
    const response = await app.appInfo()
    checkLedgerErrors(response)
    return response.appName
  }

  const isAppOpen = async () => {
    const appName = await getAppName()
    if (!['Terra', 'Cosmos'].includes(appName)) {
      throw new Error(`Close ${appName} and open the Terra app`)
    }
  }

  const isVersionUpdated = async () => {
    const getAppVersion = async () => {
      const response = await app.getVersion()
      checkLedgerErrors(response)
      const { major, minor, patch } = response
      return `${major}.${minor}.${patch}`
    }

    const version = await getAppVersion()

    if (!semver.gte(version, REQUIRED_APP_VERSION)) {
      throw new Error(
        'Outdated version: Please update Ledger Terra App to the latest version.'
      )
    }
  }

  const getPath = async () => {
    const appName = await getAppName()
    const bip = { Cosmos: 118, Terra: 330 }[appName]
    return [44, bip, 0, 0, 0]
  }

  const isReady = async () => {
    await isAppOpen()
    await isVersionUpdated()
  }

  const transport = await Transport.create()
  const app = new Cosmos(transport)
  await isReady()

  return { app, path: await getPath() }
}

const getPubKey = async () => {
  const { app, path } = await connect()
  const response = await app.getAddressAndPubKey(path, 'terra')
  checkLedgerErrors(response)
  return response.compressed_pk
}

const checkLedgerErrors = ({ error_message, device_locked }) => {
  if (device_locked) {
    throw new Error(`Ledger's screensaver mode is on`)
  }

  switch (error_message) {
    case 'U2F: Timeout':
      throw new Error('Could not find a connected and unlocked Ledger device')

    case 'Cosmos app does not seem to be open':
      throw new Error('App is not open')

    case 'Command not allowed':
      throw new Error('Transaction rejected')

    case 'Transaction rejected':
      throw new Error('User rejected the transaction')

    case 'Unknown Status Code: 26628':
      throw new Error(`Ledger's screensaver mode is on`)

    case 'Instruction not supported':
      throw new Error(
        'Your Ledger App is not up to date. ' +
          `Please update to version ${REQUIRED_APP_VERSION}.`
      )

    case 'No errors':
      break

    default:
      throw new Error(error_message)
  }
}

export default {
  getPubKey,
  getTerraAddress: async () => {
    const pubKey = await getPubKey()
    return getTerraAddress(pubKey)
  },
  sign: async signMessage => {
    const { app, path } = await connect()
    const response = await app.sign(path, signMessage)
    return signatureImport(response.signature)
  }
}
