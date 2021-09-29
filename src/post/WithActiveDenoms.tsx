import { ReactNode } from 'react'
import { useActiveDenoms } from '../lib'

interface Props {
  children: (denoms: string[]) => ReactNode
}

const WithActiveDenoms = ({ children }: Props) => {
  const { data } = useActiveDenoms()
  return <>{data && data.result.length ? children(data.result) : null}</>
}

export default WithActiveDenoms
