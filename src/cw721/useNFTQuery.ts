import { useQuery } from 'react-query'
import useLCD from '../api/useLCD'
import { NFTTokenItem } from '../types'

export const useNFTQuery = (contract: string, token: string) => {
  const lcd = useLCD()
  return useQuery({
    queryKey: ['cw721TokenInfo', contract, token],
    queryFn: async () =>
      await lcd.wasm.contractQuery<NFTTokenItem>(contract, {
        nft_info: { token_id: token },
      }),
  })
}

export default useNFTQuery
