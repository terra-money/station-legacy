import { useQueries, useQuery } from 'react-query'
import { is } from '../../utils'
import useLCD from '../../api/useLCD'
import { zipObj } from 'ramda'

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

export const useDenomTracePair = (params: string[] = []) => {
  const denoms = params.filter((denom) => is.ibcDenom(denom))
  const results = useDenomTraceList(denoms)
  if (results.some(({ isLoading }) => isLoading)) return {}
  return zipObj(
    denoms,
    results.map(({ data }) => data?.base_denom ?? '')
  )
}
