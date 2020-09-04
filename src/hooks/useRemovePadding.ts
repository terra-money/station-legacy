import { useApp } from './useApp'
import { useEffect } from 'react'

export default () => {
  const { setPadding } = useApp()

  useEffect(() => {
    setPadding(false)
    return () => setPadding(true)
  }, [setPadding])
}
