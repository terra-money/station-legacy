import { FormUI, Field, Card, ButtonAttrs, BankData } from '..'

export interface AuthMenu {
  ui: { mobile: Card; web: AuthMenuUI }
  list: AuthMenuItem[]
}

export type AuthMenuKey =
  | 'recover'
  | 'importKey'
  | 'signUp'
  | 'signIn'
  | 'signInWithAddress'
  | 'signInWithLedger'
  | 'download'

export interface AuthMenuUI {
  signInWithLedger: [string, string]
  tooltip: { label: string; link: string; i18nKey: string }
}

interface AuthMenuItem {
  label: string
  key: AuthMenuKey
}

/* Sign up */
export type Seed = string[]
export type Bip = 118 | 330
export type BipList = [Bip, Bip]
export type SignUpFn = (bip?: Bip) => Promise<void>
export type SignUpStep = 'select' | 'confirm'

export interface ImportKey {
  form: FormUI
  error?: Error
}

export interface SignUp {
  form: FormUI
  mnemonics: Mnemonics
  warning: SignUpWarning
  error?: Error
  next?: SignUpNext
  reset?: () => void
}

export interface SignUpWarning {
  tooltip: [string, string]
  i18nKey: string
}

export interface Mnemonics {
  title: string
  fields: Field[]
  warning?: string
  paste: (clipboard: string, index: number) => void
  suggest: (input: string) => string[]
}

export interface SignUpNext {
  step: SignUpStep
  seed: Seed
  accounts?: Account[]
  signUp: SignUpFn
}

export interface Account {
  bip: Bip
  address: string
  bank: BankData
}

export type Generate = (
  phrase: string,
  list: BipList
) => Promise<[string, string]>

export interface SelectAccount {
  form?: FormUI<AccountUI>
  result?: Card
}

export interface AccountUI {
  bip: Bip
  badges: string[]
  balances: string | string[]
}

export interface ConfirmSeed {
  form: FormUI
  hint: { label: string; onClick: (i: number) => void }[]
  result?: Card
}

/* SignIn */
export interface SignIn {
  form: FormUI
  manage: [string, string]
}

export interface SignInWithAddress {
  form: FormUI
}

export interface ManageAccounts {
  title: string
  delete: Card
  password: { title: string; content: string; tooltip: string }
}

export interface RecentAddresses {
  title: string
  deleteAll: string
  buttons: ButtonAttrs[]
}

export type TestPassword = (params: {
  name: string
  password: string
}) => boolean

export type ChangePassword = FormUI

/* Download */
export interface Download {
  title: string
  links: (DownloadLink | DownloadLinks)[]
}

export interface DownloadLink {
  key: string
  label: string
  link: string
  ext: string
}
export interface DownloadLinks {
  key: string
  label: string
  links: { link: string; ext: string }[]
}
