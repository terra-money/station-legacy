import { useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks'

const SignOut = () => {
  const auth = useAuth()
  const signout = useCallback(auth.signout, [])

  useEffect(() => {
    signout()
  }, [signout])

  return null
}

export default SignOut
