import { useCallback, useEffect, useState } from 'react'
import { Dictionary } from 'ramda'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { TokenBalance, Tokens } from '../types'
import { useConfig } from '../contexts/ConfigContext'
import useWhitelist from './useWhitelist'
import mantleURL from './mantle.json'
import alias from './alias'

export interface TokenBalanceQuery {
  loading: boolean
  whitelist?: Tokens
  list?: TokenBalance[]
  load: () => Promise<void>
}

export default (address: string): TokenBalanceQuery => {
  const [result, setResult] = useState<Dictionary<string>>()
  const [loading, setLoading] = useState(false)
  const { chain } = useConfig()
  const { name: currentChain } = chain.current
  const { whitelist, loading: loadingWhitelist } = useWhitelist(currentChain)
  const mantle = (mantleURL as Dictionary<string | undefined>)[currentChain]

  const load = useCallback(async () => {
    if (whitelist) {
      setLoading(true)

      try {
        const client = new ApolloClient({
          uri: mantle,
          cache: new InMemoryCache(),
        })

        const queries = alias(
          Object.values(whitelist).map(({ token }) => ({
            token,
            contract: token,
            msg: { balance: { address } },
          }))
        )

        const { data } = await client.query({ query: queries })
        setResult(parseResult(data))
      } catch (error) {
        setResult({})
      }

      setLoading(false)
    }
  }, [address, mantle, whitelist])

  useEffect(() => {
    address && load()
  }, [address, whitelist, mantle, load])

  return {
    load,
    loading: loading || loadingWhitelist,
    whitelist,
    list:
      result &&
      whitelist &&
      Object.entries(result).map(([token, balance]) => ({
        ...whitelist[token],
        balance,
      })),
  }
}

const parseResult = (data: Dictionary<{ Result: string }>) =>
  Object.entries(data).reduce(
    (acc, [token, { Result }]) => ({
      ...acc,
      [token]: JSON.parse(Result).balance,
    }),
    {}
  )
