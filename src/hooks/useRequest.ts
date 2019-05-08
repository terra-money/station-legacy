import { useState, useEffect } from 'react'
import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios'
import api from '../api/api'
import { report } from '../utils'

export default ({ url = '', params, list }: RequestProps): ResponseProps => {
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    const request = async (): Promise<void> => {
      init()

      try {
        type A = (arg0: AxiosRequestConfig) => AxiosPromise
        const getPromise: A = ({ url = '', params }) => api.get(url, { params })
        const getData = ({ data }: AxiosResponse) => data

        setData(
          list
            ? (await Promise.all(list.map(getPromise))).map(getData)
            : getData(await api.get(url, { params }))
        )
      } catch (error) {
        report(error)
        setError(error)
      }

      setIsLoading(false)
    }

    request()
  }, [url, params, list])

  const init = (): void => {
    setError(undefined)
    setIsLoading(true)
  }

  return { data, isLoading, error }
}
