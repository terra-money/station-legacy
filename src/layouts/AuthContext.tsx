import { useState, createContext } from 'react'
import { prependRecent, findName } from '../utils/localStorage'
import { setLastAddress, removeLastAddress } from '../utils/localStorage'

type AuthContext = Auth & {
  signin: (params: { name?: string; address: string }) => void
  signout: () => void
}

const initial = Object.assign(
  { signin: () => {}, signout: () => {} },
  { name: '', address: '' }
)

/* hooks */
type Params = { onSignIn: Function; onSignOut: Function }
type Ctx = ({ onSignIn, onSignOut }: Params) => AuthContext
export const useAuthContext: Ctx = ({ onSignIn, onSignOut }) => {
  const [name, setName] = useState<string>('')
  const [address, setAddress] = useState<string>('')

  const init = (): void => {
    setName('')
    setAddress('')
  }

  const signin: AuthContext['signin'] = ({ name, address }) => {
    const signin = () => {
      setName(name || findName(address) || '')
      setAddress(address)
      onSignIn()

      prependRecent(address)
      setLastAddress(address)
    }

    address && signin()
  }

  const signout = (): void => {
    init()
    onSignOut()

    removeLastAddress()
  }

  const data = { name, address }
  const actions = { signin, signout }
  return { ...data, ...actions }
}

/* context */
export default createContext<AuthContext>(initial)
