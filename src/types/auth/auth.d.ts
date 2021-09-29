type Address = string

interface User {
  address: Address
  name?: string
  wallet?: string
  ledger?: boolean
  provider?: boolean
}

interface LocalUser extends User {
  name: string
}

interface Auth {
  user?: User
  signIn: (user: User) => void
  signOut: () => void
}

interface Wallet {
  privateKey: string
  publicKey: string
  terraAddress: string
}

interface WalletParams {
  name: string
  password: string
  wallet: Wallet
}
