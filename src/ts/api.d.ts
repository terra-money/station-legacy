interface RequestProps {
  url?: string
  params?: object
  list?: AxiosRequestConfig[]
}

interface ResponseProps {
  data: any
  isLoading: boolean
  error?: Error
}
