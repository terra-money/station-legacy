import { AxiosError } from 'axios'

export interface API<T = undefined> {
  loading: boolean
  error?: Error | AxiosError
  data?: T
  execute: () => Promise<void>
}
