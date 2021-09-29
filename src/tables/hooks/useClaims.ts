import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ClaimsPage, ClaimsData, Claim } from '../../types'
import { format, gt } from '../../utils'
import useFCD from '../../api/useFCD'
import useFinder from '../../hooks/useFinder'

export default (address: string): ClaimsPage => {
  const { t } = useTranslation()
  const getLink = useFinder()

  /* api */
  const [claims, setClaims] = useState<Claim[]>([])
  const [offset, setOffset] = useState<number>()
  const [next, setNext] = useState<number>()
  const [done, setDone] = useState(false)

  const url = `/v1/staking/validators/${address}/claims`
  const params = { offset }
  const response = useFCD<ClaimsData>({ url, params })
  const { data } = response

  useEffect(() => {
    if (data) {
      setClaims((claims) => [...claims, ...data.claims])
      setNext(data.next)
      setDone(data.claims.length < data.limit)
    }
  }, [data])

  const more = claims.length && !done ? () => setOffset(next) : undefined

  /* render */
  const ui =
    !claims || !gt(claims.length, 0)
      ? {
          card: {
            content: t('Page:Staking:This validator has no claim history yet'),
          },
        }
      : {
          more,
          table: {
            headings: {
              hash: t('Common:Tx:Tx Hash'),
              type: t('Common:Type'),
              displays: t('Common:Tx:Amount'),
              date: t('Common:Time'),
            },

            contents: claims.map(({ txhash, type, amounts, timestamp }) => ({
              link: getLink!({ q: 'tx', v: txhash }),
              hash: format.truncate(txhash, [6, 6]),
              type: t('Page:Staking:' + type),
              displays: amounts?.map((coin) => format.display(coin)) ?? [],
              date: format.date(timestamp),
            })),
          },
        }

  return { ...response, title: t('Page:Staking:Claim log'), ui }
}
