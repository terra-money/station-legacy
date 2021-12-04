import { useQueries, useQuery } from 'react-query'
import { is } from '../../utils'
import useLCD from '../../api/useLCD'
import { fromPairs, zip } from 'ramda'

export const useGetQueryDenomTrace = () => {
  const lcd = useLCD()
  return (denom = '') => ({
    queryKey: ['denomTrace', denom],
    queryFn: async () => {
      if (!is.ibcDenom(denom)) return
      const hash = denom.replace('ibc/', '')
      const denom_trace = await lcd.ibcTransfer.denomTrace(hash)
      return denom_trace
    },
  })
}

export const useDenomTrace = (denom = '') => {
  const getQuery = useGetQueryDenomTrace()
  return useQuery(getQuery(denom))
}

export const useDenomTraceList = (denoms: string[]) => {
  const getQuery = useGetQueryDenomTrace()
  return useQueries(denoms.map(getQuery))
}

export const useDenomTracePair = (denoms: string[] = []) => {
  const results = useDenomTraceList(denoms)
  return fromPairs(
    zip(
      denoms,
      results.map(({ data }) => data?.base_denom ?? '')
    )
  )
}
