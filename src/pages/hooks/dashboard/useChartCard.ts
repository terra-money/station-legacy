import { useState, useEffect, useRef } from 'react'
import { useQueries } from 'react-query'
import { useTranslation } from 'react-i18next'
import { ChartCard, ChartFilter } from '../../../types'
import { CumulativeType, AccountType } from '../../../types'
import { format, is } from '../../../utils'
import { useGetQueryDenomTrace } from '../../../data/lcd/ibc'
import useFCD from '../../../api/useFCD'

export interface Props<T = any> {
  title: string
  desc: string

  /** Endpoint to fetch chart data */
  url: string | ((filter: Filter) => string)

  /** Initial configurations of the filter */
  filterConfig?: FilterConfig
  cumulativeLabel?: { [CumulativeType.C]: string; [CumulativeType.P]: string }

  /** One value representing the chart */
  getValue: (results: T[], filter: Filter, payload?: any) => ChartCard['value']

  /** All values ​​to display on the chart */
  getChart: (results: T[], filter: Filter) => ChartCard['chart']
}

interface FilterConfig {
  type?: Config<CumulativeType>
  denom?: Config<string>
  account?: Config<AccountType>
  duration?: Config<number>
}

interface Config<T> {
  initial?: T
  list?: T[]
}

interface Filter {
  /** Cumulative | Periodic */
  type?: CumulativeType
  denom?: string
  account?: AccountType
  duration: number
}

export default <T extends { denom?: string }>(props: Props): ChartCard => {
  const { t } = useTranslation()

  const DefaultCumulativeLabel = {
    [CumulativeType.C]: t('Page:Chart:Cumulative'),
    [CumulativeType.P]: t('Page:Chart:Periodic'),
  }

  const accountLabel = {
    [AccountType.A]: t('Page:Chart:Active'),
    [AccountType.T]: t('Page:Chart:Total'),
  }

  const { url, filterConfig: config, getValue, getChart, ...rest } = props
  const { cumulativeLabel = DefaultCumulativeLabel } = rest

  /* state: filter */
  const [type, setType] = useState(config?.type?.initial ?? CumulativeType.C)
  const [denom, setDenom] = useState(config?.denom?.initial)
  const [duration, setDuration] = useState(config?.duration?.initial ?? 0)
  const [account, setAccount] = useState(config?.account?.initial)
  const filter: Filter = { type, denom, duration, account }

  const prevType = usePrevious<CumulativeType>(type)

  useEffect(() => {
    // Condition below is not possible
    const disabled = account === AccountType.A && type === CumulativeType.C

    disabled &&
      (prevType !== type
        ? setAccount(AccountType.T)
        : setType(CumulativeType.P))

    // eslint-disable-next-line
  }, [type, account])

  /* api */
  type Response = T[] | ({ [key in CumulativeType]: T[] } & { total?: number })
  const getURL = () => (typeof url === 'string' ? url : url(filter))
  const { data } = useFCD<Response>({ url: getURL() })
  const results = Array.isArray(data) ? data : data?.[type]

  const denoms =
    results?.filter(({ denom }) => denom).map(({ denom }) => denom) ?? []
  const getQuery = useGetQueryDenomTrace()
  const r = useQueries(denoms?.map((denom) => getQuery(denom)) ?? [])
  const denomTraces = r.map(({ data }) => data?.base_denom)
  const isDenomTracesLoading = r.some(({ isLoading }) => isLoading)

  /* render */
  const renderFilter = (): ChartFilter => ({
    type: config?.type
      ? {
          value: type,
          set: setType,
          options: [CumulativeType.C, CumulativeType.P].map((value) => ({
            value,
            children: cumulativeLabel[value],
          })),
        }
      : undefined,
    denom:
      config?.denom && results && !isDenomTracesLoading
        ? {
            value: denom!,
            set: setDenom,
            options: results.map(({ denom }, index) => ({
              value: denom!,
              children: format.denom(
                is.ibcDenom(denom) ? denomTraces[index] : denom!
              ),
            })),
          }
        : undefined,
    account: config?.account
      ? {
          value: account!,
          set: setAccount,
          options: [AccountType.A, AccountType.T].map((value) => ({
            value,
            children: accountLabel[value],
          })),
        }
      : undefined,
    duration: {
      value: String(duration),
      set: (v: string) => setDuration(Number(v)),
      options: (config?.duration?.list ?? [0, 7, 14, 30]).map((value) => ({
        value: String(value),
        children:
          value === 0
            ? t('Page:Chart:From genesis')
            : value === 3
            ? t('Page:Chart:Last day')
            : t('Page:Chart:{{d}} days', { d: value }),
      })),
    },
  })

  return Object.assign(
    { ...rest, filter: renderFilter() },
    results && {
      value: getValue(results, filter, data && 'total' in data && data.total),
      chart: getChart(results, filter),
    }
  )
}

/* hooks */
const usePrevious = <T>(value: T): T => {
  const ref = useRef<T>(value)

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
