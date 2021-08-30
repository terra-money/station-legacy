import { useCallback, useEffect, useState } from 'react'
import { Dictionary } from 'ramda'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { TokenBalance, Tokens } from '../types'
import { useConfig } from '../contexts/ConfigContext'
import { useTokens } from '../../data/local'
import mantleURL from './mantle.json'
import alias from './alias'

export interface TokenBalanceQuery {
  loading: boolean
  tokens?: Tokens
  result?: Dictionary<string>
  list?: TokenBalance[]
  load: () => Promise<void>
}

export default (address: string): TokenBalanceQuery => {
  const [result, setResult] = useState<Dictionary<string>>()
  const [loading, setLoading] = useState(false)
  const { chain } = useConfig()
  const { name: currentChain } = chain.current
  const tokens = useTokens()
  const mantle = (mantleURL as Dictionary<string | undefined>)[currentChain]

  const load = useCallback(async () => {
    if (!Object.keys(tokens).length) {
      setResult({})
    } else {
      setLoading(true)

      try {
        const client = new ApolloClient({
          uri: mantle,
          cache: new InMemoryCache(),
        })

        const queries = alias(
          Object.values(tokens).map(({ token }) => ({
            token,
            contract: token,
            msg: { balance: { address } },
          }))
        )

        const { data } = await client.query({
          query: queries,
          errorPolicy: 'all',
        })

        setResult(parseResult(data))
      } catch (error) {
        setResult({})
      }

      setLoading(false)
    }
  }, [address, mantle, tokens])

  useEffect(() => {
    address && load()
  }, [address, tokens, mantle, load])

  return {
    load,
    loading,
    tokens,
    result,
    list:
      result &&
      tokens &&
      Object.entries(result).map(([token, balance]) => ({
        ...tokens[token],
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
