import { useState, useEffect, useCallback, useRef } from 'react'
import axios, { AxiosError, AxiosRequestConfig as Config } from 'axios'
import qs from 'qs'
import { API } from '../types'
import fcd from './fcd'

const { CancelToken } = axios
export default <T>(
  { url, params }: Config,
  immediate: boolean = true
): API<T> => {
  const mounted = useRef(false)
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState<boolean>(immediate)
  const [error, setError] = useState<Error | AxiosError>()

  /* request */
  const query = qs.stringify(params)
  const source = CancelToken.source()
  const execute = useCallback(async () => {
    try {
      setLoading(true)
      setError(undefined)

      const { token: cancelToken } = source
      const { data } = await fcd.get<T>(`${url}?${query}`, {
        cancelToken,
      })
      setData(data)
    } catch (error) {
      !axios.isCancel(error) && setError(error)
    } finally {
      mounted.current && setLoading(false)
    }

    // eslint-disable-next-line
  }, [url, query])

  useEffect(() => {
    mounted.current = true
    immediate && execute()
    return () => {
      mounted.current = false
      source.cancel()
    }
    // eslint-disable-next-line
  }, [execute, immediate])

  return { data, loading, error, execute }
}
