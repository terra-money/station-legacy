import { useState } from 'react'
import { Auth, User } from '../types'
import createContext from './createContext'

export const [useAuth, AuthProvider] = createContext<Auth>()

export const useAuthState = (initial?: User): Auth => {
  const [user, setUser] = useState<User | undefined>(initial)
  return { user, signIn: setUser, signOut: () => setUser(undefined) }
}
