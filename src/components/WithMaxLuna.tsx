import React, { ReactNode } from 'react'
import { find } from '../utils'
import { useAuth } from '../hooks'
import WithRequest from './WithRequest'

interface Props {
  children: (max: string, balance: Balance[]) => ReactNode
}

const WithMaxLuna = ({ children }: Props) => {
  const { address } = useAuth()

  return !address ? null : (
    <WithRequest url={`/v1/bank/${address}`}>
      {({ balance }: Bank) => {
        const b = find<Balance>(balance)('uluna')
        return children(b ? b.available : String(0), balance)
      }}
    </WithRequest>
  )
}

export default WithMaxLuna
