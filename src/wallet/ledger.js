import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import TerraLedger from '@terra-money/ledger-terra-js'
import { signatureImport } from 'secp256k1'
import semver from 'semver'
import { getTerraAddress } from './keys'

const INTERACTION_TIMEOUT = 120
const REQUIRED_COSMOS_APP_VERSION = '2.12.0'
const REQUIRED_APP_VERSION = '1.0.0'

let app = null
let path = null

const connect = async () => {
  if (app) {
    const response = await app.appInfo()

    if (['Terra', 'Cosmos'].includes(response.appName)) {
      return { app, path }
    } else {
      app = path = null
    }
  }

  getBrowser(navigator.userAgent)

  let transport
  if (isWindows(navigator.platform)) {
    if (!navigator.hid) {
      throw new Error(
        `Your browser doesn't have HID enabled.\nPlease enable this feature by visiting:\nchrome://flags/#enable-experimental-web-platform-features`
      )
    }

    transport = await TransportWebHID.create(INTERACTION_TIMEOUT * 1000)
  } else {
    // OSX / Linux
    try {
      transport = await TransportWebUSB.create(INTERACTION_TIMEOUT * 1000)
    } catch (err) {
      /* istanbul ignore next: specific error rewrite */
      if (
        err.message
          .trim()
          .startsWith('No WebUSB interface found for your Ledger device')
      ) {
        throw new Error(
          `Couldn't connect to a Ledger device. Please use Ledger Live to upgrade the Ledger firmware to version ${REQUIRED_APP_VERSION} or later.`
        )
      }
      /* istanbul ignore next: specific error rewrite */
      if (err.message.trim().startsWith('Unable to claim interface')) {
        // apparently can't use it in several tabs in parallel
        throw new Error(
          'Could not access Ledger device. Is it being used in another tab?'
        )
      }
      /* istanbul ignore next: specific error rewrite */
      if (err.message.trim().startsWith('Not supported')) {
        // apparently can't use it in several tabs in parallel
        throw new Error(
          "Your browser doesn't seem to support WebUSB yet. Try updating it to the latest version."
        )
      }
      /* istanbul ignore next: specific error rewrite */
      if (err.message.trim().startsWith('No device selected')) {
        // apparently can't use it in several tabs in parallel
        throw new Error(
          "Couldn't find the Ledger. Check your Ledger is plugged in and unlocked."
        )
      }

      // throw unknown error
      throw err
    }
  }

  app = new TerraLedger(transport)

  const getAppName = async () => {
    const response = await app.appInfo()
    checkLedgerErrors(response)
    return response.appName
  }

  const getAppVersion = async () => {
    const response = await app.getVersion()
    checkLedgerErrors(response)
    const { major, minor, patch } = response
    return `${major}.${minor}.${patch}`
  }

  const getPath = (appName) => {
    const bip = { Cosmos: 118, Terra: 330 }[appName]
    return [44, bip, 0, 0, 0]
  }

  const initialize = async () => {
    const appName = await getAppName()

    if (!['Terra', 'Cosmos'].includes(appName)) {
      throw new Error(`Open the Terra app in your Ledger.`)
    }

    const version = await getAppVersion()

    if ((appName === 'Terra' && !semver.gte(version, REQUIRED_APP_VERSION)) ||
       (appName === 'Cosmos' && !semver.gte(version, REQUIRED_COSMOS_APP_VERSION))) {
      throw new Error(
        'Outdated version: Please update Ledger Terra App to the latest version.'
      )
    }

    path = getPath(appName)
  }

  return initialize()
}

const getPubKey = async () => {
  await connect()
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
      throw new Error('Could not find a connected and unlocked Ledger device.')

    case 'Cosmos app does not seem to be open':
      throw new Error('Open the Terra app in your Ledger.')

    case 'Command not allowed':
      throw new Error('Transaction rejected.')

    case 'Transaction rejected':
      throw new Error('User rejected the transaction.')

    case 'Unknown Status Code: 26628':
      throw new Error(`Ledger's screensaver mode is on.`)

    case 'Instruction not supported':
      throw new Error(
        'Please check your Ledger is running latest version of Terra.'
      )

    case 'No errors':
      break

    default:
      throw new Error(error_message)
  }
}

const isWindows = (platform) => platform.indexOf('Win') > -1
const getBrowser = (userAgent) => {
  const ua = userAgent.toLowerCase()
  const isChrome = /chrome|crios/.test(ua) && !/edge|opr\//.test(ua)
  const isBrave = isChrome && !window.google

  if (!isChrome && !isBrave) {
    throw new Error("Your browser doesn't support Ledger devices.")
  }

  if (isBrave) return 'brave'
  if (isChrome) return 'chrome'
}

export default {
  getPubKey,
  getTerraAddress: async () => {
    const pubKey = await getPubKey()
    return getTerraAddress(pubKey)
  },
  sign: async (signMessage) => {
    const { app, path } = await connect()
    const response = await app.sign(path, signMessage)
    return signatureImport(response.signature)
  },
}
