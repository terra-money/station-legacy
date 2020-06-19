import TerraApp from '@terra-money/ledger-terra-js'
import { signatureImport } from 'secp256k1'
import semver from 'semver'
import { getTerraAddress } from './keys'
import { electron } from '../utils'
import { isElectron } from '../utils/env'

const INTERACTION_TIMEOUT = 120
const REQUIRED_COSMOS_APP_VERSION = '2.12.0'
const REQUIRED_APP_VERSION = '1.0.0'
const REQUIRED_ELECTRON_APP_VERSION = '1.1.0'

let app = null
let appName = null
let path = null
let transport = null

const handleConnectError = err => {
  app = path = appName = null

  const message = err.message.trim()

  /* istanbul ignore next: specific error rewrite */
  if (message.startsWith('No WebUSB interface found for your Ledger device')) {
    throw new Error(
      `Couldn't connect to a Ledger device. Please use Ledger Live to upgrade the Ledger firmware to version ${REQUIRED_APP_VERSION} or later.`
    )
  }

  /* istanbul ignore next: specific error rewrite */
  if (message.startsWith('Unable to claim interface')) {
    // apparently can't use it in several tabs in parallel
    throw new Error(
      'Could not access Ledger device. Is it being used in another tab?'
    )
  }

  /* istanbul ignore next: specific error rewrite */
  if (message.startsWith('Not supported')) {
    // apparently can't use it in several tabs in parallel
    throw new Error(
      "Your browser doesn't seem to support WebUSB yet. Try updating it to the latest version."
    )
  }

  /* istanbul ignore next: specific error rewrite */
  if (message.startsWith('No device selected')) {
    // apparently can't use it in several tabs in parallel
    throw new Error(
      "Couldn't find the Ledger. Check your Ledger is plugged in and unlocked."
    )
  }

  // throw unknown error
  throw err
}

const handleTransportError = err => {
  if (err.message.startsWith('The device is already open')) {
    return
  }

  throw err
}

const createTerraApp = async () => {
  if (isElectron) {
    const version = electron('version')

    if (semver.lt(version, REQUIRED_ELECTRON_APP_VERSION)) {
      throw new Error('Please update Station to use Ledger.')
    }

    transport = await electron('createLedgerApp', [INTERACTION_TIMEOUT * 1000])
    app = {}
    ;[
      'appInfo',
      'getVersion',
      'getAppVersion',
      'getAddressAndPubKey',
      'showAddressAndPubKey',
      'sign'
    ].forEach(methodName => {
      app[methodName] = function() {
        return electron(methodName, Array.from(arguments))
      }
    })
  } else {
    getBrowser(navigator.userAgent)

    if (isWindows(navigator.platform)) {
      // For Windows
      if (!navigator.hid) {
        throw new Error(
          `Your browser doesn't have HID enabled.\nPlease enable this feature by visiting:\nchrome://flags/#enable-experimental-web-platform-features`
        )
      }

      const TransportWebHid = require('@ledgerhq/hw-transport-webhid').default
      transport = await TransportWebHid.create(
        INTERACTION_TIMEOUT * 1000
      ).catch(handleTransportError)
    } else {
      // For other than Windows
      const TransportWebUsb = require('@ledgerhq/hw-transport-webusb').default
      transport = await TransportWebUsb.create(
        INTERACTION_TIMEOUT * 1000
      ).catch(handleTransportError)
    }

    app = new TerraApp(transport)
    await app.initialize()
  }

  if (transport && typeof transport.on === 'function') {
    transport.on('disconnect', () => {
      app = path = appName = transport = null
    })
  }
}

const connect = async () => {
  if (app) {
    return
  }

  await createTerraApp()

  const getAppName = async () => {
    const response = await app.appInfo()
    checkLedgerErrors(response)
    return response.appName
  }

  appName = await getAppName()

  const getAppVersion = async () => {
    const response = await app.getVersion()
    checkLedgerErrors(response)
    const { major, minor, patch } = response
    return `${major}.${minor}.${patch}`
  }

  const checkAppVersion = async () => {
    if (!['Terra', 'Cosmos'].includes(appName)) {
      throw new Error(`Open the Terra app in your Ledger.`)
    }

    const version = await getAppVersion()

    if (
      (appName === 'Terra' && semver.lt(version, REQUIRED_APP_VERSION)) ||
      (appName === 'Cosmos' && semver.lt(version, REQUIRED_COSMOS_APP_VERSION))
    ) {
      throw new Error(
        'Outdated version: Please update Ledger Terra App to the latest version.'
      )
    }
  }

  await checkAppVersion()

  const getPath = appName => {
    const bip = { Cosmos: 118, Terra: 330 }[appName]
    return [44, bip, 0, 0, 0]
  }

  path = getPath(appName)
}

const getPubKey = async () => {
  await connect().catch(handleConnectError)
  const response = await app.getAddressAndPubKey(path, 'terra')
  checkLedgerErrors(response)
  return response.compressed_pk
}

const showAddressInLedger = async () => {
  await connect().catch(handleConnectError)
  const response = await app.showAddressAndPubKey(path, 'terra')
  checkLedgerErrors(response)
}

const checkLedgerErrors = ({ error_message, device_locked }) => {
  if (device_locked) {
    throw new Error(`Ledger's screensaver mode is on.`)
  }

  if (error_message.startsWith('TransportRaceCondition')) {
    throw new Error('Please finish previous action in Ledger.')
  } else if (error_message.startsWith('DisconnectedDeviceDuringOperation')) {
    app = path = null
    throw new Error('Open the Terra app in your Ledger.')
  }

  switch (error_message) {
    case 'U2F: Timeout':
      throw new Error('Could not find a connected and unlocked Ledger device.')

    case 'App does not seem to be open':
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

const isWindows = platform => platform.indexOf('Win') > -1
const getBrowser = userAgent => {
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
  showAddressInLedger,
  getTerraAddress: async () => {
    const pubKey = await getPubKey()
    return getTerraAddress(pubKey)
  },
  sign: async signMessage => {
    await connect().catch(handleConnectError)
    const response = await app.sign(path, signMessage)
    return signatureImport(Buffer.from(response.signature))
  }
}
