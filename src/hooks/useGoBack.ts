import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from './useApp'

export default (path: string) => {
  const { state } = useLocation<{ from: string }>()
  const { setGoBack } = useApp()

  useEffect(() => {
    setGoBack(state?.from ?? path)
    return () => setGoBack('')
    // eslint-disable-next-line
  }, [])
}
