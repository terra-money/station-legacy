import TerraApp, {
  CommonResponse,
  PublicKeyResponse,
  SignResponse,
  VersionResponse,
  DeviceInfoResponse,
  AppInfoResponse,
} from '@terra-money/ledger-terra-js'
import { signatureImport } from 'secp256k1'
import semver from 'semver'
import { electron } from '../utils'
import { isElectron } from '../utils/env'

const INTERACTION_TIMEOUT = 120
const REQUIRED_COSMOS_APP_VERSION = '2.12.0'
const REQUIRED_APP_VERSION = '1.0.0'
export const REQUIRED_ELECTRON_APP_VERSION = '1.1.0'

declare global {
  interface Window {
    google: any
  }
  interface Navigator {
    hid: any
  }
}

class TerraElectronBridge extends TerraApp {
  constructor() {
    super({})
  }

  async initialize(): Promise<CommonResponse | null> {
    return electron('ledger:initialize')
  }

  getInfo(): AppInfoResponse {
    return electron('ledger:getInfo')
  }

  getVersion(): VersionResponse {
    return electron('ledger:getVersion')
  }

  getDeviceInfo(): Promise<DeviceInfoResponse> {
    return electron('ledger:getDeviceInfo')
  }

  getPublicKey(...args: any[]): Promise<PublicKeyResponse> {
    return electron('ledger:getPublicKey', args)
  }

  getAddressAndPubKey(...args: any[]): Promise<PublicKeyResponse> {
    return electron('ledger:getAddressAndPubKey', args)
  }

  showAddressAndPubKey(...args: any[]): Promise<PublicKeyResponse> {
    return electron('ledger:showAddressAndPubKey', args)
  }

  sign(...args: any[]): Promise<SignResponse> {
    return electron('ledger:sign', args)
  }
}

let app: TerraApp | TerraElectronBridge | null = null
let path: number[] | null = null
let transport: any = null

const handleTransportError = (err: Error) => {
  if (err.message.startsWith('The device is already open')) {
    // ignore this error
    return transport
  }

  if (err.name === 'TransportOpenUserCancelled') {
    throw new Error(
      `Couldn't find the Ledger. Check your Ledger is plugged in and unlocked.`
    )
  }

  throw err
}

const handleConnectError = (err: Error) => {
  app = path = null

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
    throw new Error(
      `Your browser doesn't seem to support WebUSB yet. Try updating it to the latest version.`
    )
  }

  /* istanbul ignore next: specific error rewrite */
  if (message.startsWith('No device selected')) {
    throw new Error(
      `Couldn't find the Ledger. Check your Ledger is plugged in and unlocked.`
    )
  }

  // throw unknown error
  throw err
}

const checkLedgerErrors = (response: CommonResponse | null) => {
  if (!response) {
    return
  }

  const { error_message, device_locked } = response

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

async function createTerraApp(): Promise<TerraApp | TerraElectronBridge> {
  let app

  if (isElectron) {
    const version: string = electron('version')

    if (semver.lt(version, REQUIRED_ELECTRON_APP_VERSION)) {
      throw new Error('Outdated version: Please update Station to use Ledger.')
    }

    app = new TerraElectronBridge()
  } else {
    checkBrowser(navigator.userAgent)

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

    if (transport && typeof transport.on === 'function') {
      transport.on('disconnect', () => {
        app = path = transport = null
      })
    }

    app = new TerraApp(transport)
  }

  const result = await app.initialize()
  checkLedgerErrors(result)

  return app
}

const connect = async () => {
  if (app) {
    return
  }

  app = await createTerraApp()
  const { app_name: appName } = app.getInfo()

  if (!['Terra', 'Cosmos'].includes(appName)) {
    throw new Error(`Open the Terra app in your Ledger.`)
  }

  const { major, minor, patch } = app.getVersion()
  const version = `${major}.${minor}.${patch}`

  if (
    (appName === 'Terra' && semver.lt(version, REQUIRED_APP_VERSION)) ||
    (appName === 'Cosmos' && semver.lt(version, REQUIRED_COSMOS_APP_VERSION))
  ) {
    throw new Error(
      'Outdated version: Please update Ledger Terra App to the latest version.'
    )
  }

  path = [44, appName === 'Terra' ? 330 : 118, 0, 0, 0]
}

export const close = async () => {
  if (transport) {
    transport.close()
    app = path = null
  }
}

export const getPubKey = async () => {
  await connect().catch(handleConnectError)

  if (!app) {
    return
  }

  const response = await app.getAddressAndPubKey(path, 'terra')
  checkLedgerErrors(response)
  return Buffer.from(response.compressed_pk as any)
}

export const showAddressInLedger = async () => {
  await connect().catch(handleConnectError)

  if (!app) {
    return
  }

  const response = await app.showAddressAndPubKey(path, 'terra')
  checkLedgerErrors(response)
}

export const getTerraAddress = async () => {
  await connect().catch(handleConnectError)

  if (!app) {
    return ''
  }

  const response = await app.getAddressAndPubKey(path, 'terra')
  checkLedgerErrors(response)
  return response.bech32_address
}

export const sign = async (signMessage: string) => {
  await connect().catch(handleConnectError)

  if (!app) {
    return
  }

  const { signature } = await app.sign(path, signMessage)
  return Buffer.from(signatureImport(Buffer.from(signature as any)))
}

const isWindows = (platform: string) => platform.indexOf('Win') > -1
const checkBrowser = (userAgent: string): string => {
  const ua = userAgent.toLowerCase()
  const isChrome = /chrome|crios/.test(ua) && !/edge|opr\//.test(ua)
  const isBrave = isChrome && !window.google

  if (!isChrome && !isBrave) {
    throw new Error("Your browser doesn't support Ledger devices.")
  }

  return isChrome ? 'chrome' : 'brave'
}
