import { useState, createContext } from 'react'
import { without } from 'ramda'
import { localSettings, findName } from '../utils/localStorage'

type AuthContext = Auth & {
  signin: (params: {
    address: string
    name?: string
    withLedger?: boolean
  }) => void
  signout: () => void
}

const initial = Object.assign(
  { signin: () => {}, signout: () => {} },
  { address: '', name: '', withLedger: false }
)

/* hooks */
type Params = { onSignIn: Function; onSignOut: Function }
type Ctx = ({ onSignIn, onSignOut }: Params) => AuthContext
export const useAuthContext: Ctx = ({ onSignIn, onSignOut }) => {
  const [address, setAddress] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [withLedger, setWithLedger] = useState<boolean>(false)

  const init = (): void => {
    setName('')
    setAddress('')
    setWithLedger(false)
  }

  const signin: AuthContext['signin'] = ({ name, address, withLedger }) => {
    const signin = () => {
      setName(name || findName(address) || '')
      setAddress(address)
      setWithLedger(!!withLedger)
      onSignIn()

      const { recentAddresses = [] } = localSettings.get()
      localSettings.set({
        address,
        withLedger: !!withLedger,
        recentAddresses: [address, ...without([address], recentAddresses)]
      })
    }
    address && signin()
  }

  const signout = (): void => {
    init()
    onSignOut()

    localSettings.delete(['address', 'withLedger'])
  }

  const data = { name, address, withLedger }
  const actions = { signin, signout }
  return { ...data, ...actions }
}

/* context */
export default createContext<AuthContext>(initial)
