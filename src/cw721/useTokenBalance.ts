import { useQueries } from 'react-query'
import { NFTDisplay, NFTTokenBalance, NFTTokens } from '../types'
import { useNFTTokens } from '../data/tokens'
import useLCD from '../api/useLCD'
import { useAddress } from '../data/auth'
import { LCDClient } from '@terra-money/terra.js'

export interface NFTTokenBalanceQuery {
  loading: boolean
  tokens?: NFTTokens
  result?: Dictionary<string>
  list?: NFTTokenBalance[]
  load: () => Promise<void>
}

interface queryResult {
  contract: string
  nfts: { token_id: string; info: any }[]
}

async function fetch_tokens(
  lcd: LCDClient,
  contract: string,
  tokens: string[]
): Promise<{ contract: string; nfts: { token_id: string; info: any }[] }> {
  const nfts = await Promise.all(
    tokens.map(async (token) => {
      return lcd.wasm
        .contractQuery(contract, { nft_info: { token_id: token } })
        .then((x) => {
          return { token_id: token, info: x }
        })
    })
  )

  return { contract, nfts }
}

export default (): NFTTokenBalanceQuery => {
  const address = useAddress()
  const tokens = useNFTTokens()
  const lcd = useLCD()
  const values = Object.values(tokens)

  const queries = useQueries(
    values.map(({ token }) => ({
      queryKey: ['cw721TokenBalance', token],
      queryFn: async () => {
        return await lcd.wasm
          .contractQuery<{ tokens: string[] }>(token, {
            tokens: { owner: address },
          })
          .then(async ({ tokens }) => {
            return await fetch_tokens(lcd, token, tokens)
          })
      },
    }))
  )

  const load = async () => {
    await queries.forEach(async ({ refetch }) => await refetch())
  }

  const result = queries.reduce((acc, { data: balance }, index) => {
    const { token } = values[index]

    return { ...acc, [token.length]: balance as string }
  }, {})

  const list = queries.map(({ data: balance }, index) => {
    let owned: NFTDisplay[] = []

    if (balance !== undefined) {
      const b2 = balance as queryResult

      owned = b2.nfts.map((nft) => {
        const name = nft.info?.extension?.name || nft.info?.description
        return {
          token_id: nft.token_id,
          name: name,
          img_url: nft.info?.extension?.image,
        }
      })
    }
    const len = owned.length

    return {
      ...values[index],
      owned: owned,
      balance: len.toString(10),
    }
  })

  return {
    tokens,
    load,
    result,
    list,
    loading: queries.some(({ isLoading }) => isLoading),
  }
}
