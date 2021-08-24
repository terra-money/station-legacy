export type Address = string

export interface User {
  address: Address
  name?: string
  wallet?: string
  ledger?: boolean
}

export interface LocalUser extends User {
  name: string
}

export interface Auth {
  user?: User
  signIn: (user: User) => void
  signOut: () => void
}

export interface Wallet {
  privateKey: string
  publicKey: string
  terraAddress: string
}

export interface WalletParams {
  name: string
  password: string
  wallet: Wallet
}
