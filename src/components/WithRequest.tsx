import { ReactNode } from 'react'
import { OOPS } from '../helpers/constants'
import { useRequest } from '../hooks'

type Props = RequestProps & {
  loading?: ReactNode
  error?: ReactNode
  children: Function
}

const WithRequest = (props: Props) => {
  const { url, list, params, loading, error = OOPS, children } = props
  const { data, isLoading, error: hasError } = useRequest({ url, params, list })
  return hasError ? error : isLoading ? loading || null : children(data)
}

export default WithRequest
