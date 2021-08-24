import axios from 'axios'

const instance = axios.create()

export const intercept = (fn: (height: string) => void) => {
  return instance.interceptors.response.use((response) => {
    const data = response.data

    if (data && !Array.isArray(data) && typeof data === 'object') {
      if (typeof data.height === 'string') {
        fn(data.height)
      }
    }

    return response
  })
}

export default instance
