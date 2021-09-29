import { ReactNode } from 'react'
import { AuthMenuKey } from '../lib'
import { isExtension } from '../utils/env'
import Recover from './Recover'
import ImportKey from './ImportKey'
import SignUp from './SignUp'
import SignIn from './SignIn'
import SignInWithAddress from './SignInWithAddress'
import SignInWithLedger from './SignInWithLedger'
import Download from './Download'

export interface Item {
  icon: string
  path?: string
  disabled?: boolean
  render: () => ReactNode
}

export const menu: Record<AuthMenuKey, Item> = {
  recover: {
    icon: 'settings_backup_restore',
    path: '/recover',
    render: () => <Recover />,
  },
  importKey: {
    icon: 'menu_open',
    path: '/import',
    render: () => <ImportKey />,
  },
  signUp: {
    icon: 'add_circle_outline',
    path: '/new',
    render: () => <SignUp />,
  },
  signIn: {
    icon: 'radio_button_checked',
    path: '/select',
    render: () => <SignIn />,
  },
  signInWithLedger: {
    icon: 'usb',
    path: '/ledger',
    render: () => <SignInWithLedger />,
  },
  signInWithAddress: {
    icon: 'account_balance_wallet',
    disabled: isExtension,
    render: () => <SignInWithAddress />,
  },
  download: {
    icon: 'cloud_download',
    disabled: isExtension,
    render: () => <Download />,
  },
}
