import { useQuery } from 'react-query'
import { useAddress } from '../auth/auth'
import useLCD from '../api/useLCD'

const useCW721Tokens = (contract: string) => {
  const address = useAddress()
  const lcd = useLCD()

  return useQuery({
    queryKey: ['cw721TokenBalance', contract],
    queryFn: async () =>
      await lcd.wasm.contractQuery<{ tokens: string[] }>(contract, {
        tokens: { owner: address },
      }),
  })
}

export default useCW721Tokens
