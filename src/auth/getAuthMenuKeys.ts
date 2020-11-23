import semver from 'semver'
import { AuthMenuKey } from '@terra-money/use-station'
import { electron } from '../utils'
import { isElectron, isExtension } from '../utils/env'
import { REQUIRED_ELECTRON_APP_VERSION } from '../wallet/ledger'

export default (): AuthMenuKey[] => {
  if (isElectron) {
    const version: string = electron('version')

    if (semver.lt(version, REQUIRED_ELECTRON_APP_VERSION)) {
      return ['signIn', 'signUp', 'recover']
    }

    return ['signInWithLedger', 'signIn', 'signUp', 'recover']
  } else if (isExtension) {
    return ['signInWithLedger', 'signIn', 'signUp', 'recover']
  }

  return ['signInWithLedger', 'download']
}
