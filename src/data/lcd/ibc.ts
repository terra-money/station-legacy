import { useQuery } from 'react-query'
import { DenomTrace } from '@terra-money/terra.js/dist/core/ibc-transfer/DenomTrace'
import { is } from '../../utils'
import useLCD from '../../api/useLCD'

export const useGetQueryDenomTrace = () => {
  const lcd = useLCD()
  return (denom = '') => ({
    queryKey: ['denomTrace', denom],
    queryFn: async () => {
      if (!is.ibcDenom(denom)) return
      const hash = denom.replace('ibc/', '')
      const dt = await lcd.ibcTransfer.denomTrace(hash)
      /* TODO: Remove force typing on terra.js fixed */
      const { denom_trace } = dt as unknown as { denom_trace: DenomTrace }
      return denom_trace
    },
  })
}

export const useDenomTrace = (denom = '') => {
  const getQuery = useGetQueryDenomTrace()
  return useQuery(getQuery(denom))
}
