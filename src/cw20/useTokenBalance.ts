import { useQueries } from 'react-query'
import { TokenBalance, Tokens } from '../types'
import { useTokens } from '../data/tokens'
import useLCD from '../api/useLCD'
import { useAddress } from '../data/auth'

export interface TokenBalanceQuery {
  loading: boolean
  tokens?: Tokens
  result?: Dictionary<string>
  list?: TokenBalance[]
  load: () => Promise<void>
}

export default (): TokenBalanceQuery => {
  const address = useAddress()
  const tokens = useTokens()
  const lcd = useLCD()
  const values = Object.values(tokens)

  const queries = useQueries(
    values.map(({ token }) => ({
      queryKey: ['cw20TokenBalance', token],
      queryFn: async () => {
        const { balance } = await lcd.wasm.contractQuery<{ balance: string }>(
          token,
          { balance: { address } }
        )

        return balance
      },
    }))
  )

  const load = async () => {
    await queries.forEach(async ({ refetch }) => await refetch())
  }

  const result = queries.reduce((acc, { data: balance }, index) => {
    const { token } = values[index]
    return { ...acc, [token]: balance as string }
  }, {})

  const list = queries.map(({ data: balance }, index) => ({
    ...values[index],
    balance: balance as string,
  }))

  return {
    tokens,
    load,
    result,
    list,
    loading: queries.some(({ isLoading }) => isLoading),
  }
}
