import { useEffect } from 'react'
import useApp from './useApp'

export default (path: string) => {
  const { setGoBack } = useApp()

  useEffect(() => {
    setGoBack(path)
    return () => setGoBack('')
    // eslint-disable-next-line
  }, [])
}
