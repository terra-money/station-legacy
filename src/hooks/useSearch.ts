import { useLocation } from 'react-router-dom'
import URLSearchParams from '@ungap/url-search-params'

export default (): [
  URLSearchParams,
  (entries: [string, string][]) => string
] => {
  const { search } = useLocation()

  /* helper: URL */
  const sp = new URLSearchParams(search)

  // const queries =
  const getNextSearch = (entries: [string, string][]) => {
    const sp = new URLSearchParams(search) // Prevent side effect
    entries.forEach(([key, value]) =>
      value ? sp.set(key, value) : sp.delete(key)
    )

    return `?${sp.toString()}`
  }

  return [sp, getNextSearch]
}
