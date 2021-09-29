import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DelegationsPage, DelegationsData, Event } from '../../types'
import { format, gt } from '../../utils'
import useFCD from '../../api/useFCD'
import useFinder from '../../hooks/useFinder'

export default (address: string): DelegationsPage => {
  const { t } = useTranslation()
  const getLink = useFinder()

  /* api */
  const [events, setEvents] = useState<Event[]>([])
  const [offset, setOffset] = useState<number>()
  const [next, setNext] = useState<number>()
  const [done, setDone] = useState(false)

  const url = `/v1/staking/validators/${address}/delegations`
  const params = { offset }
  const response = useFCD<DelegationsData>({ url, params })
  const { data } = response

  useEffect(() => {
    if (data) {
      setEvents((events) => [...events, ...data.events])
      setNext(data.next)
      setDone(data.events.length < data.limit)
    }
  }, [data])

  const more = events.length && !done ? () => setOffset(next) : undefined

  /* render */
  const ui =
    !events || !gt(events.length, 0)
      ? {
          card: {
            content: t('Page:Staking:No events'),
          },
        }
      : {
          more,
          table: {
            headings: {
              hash: t('Common:Tx:Tx Hash'),
              type: t('Common:Type'),
              change: t('Common:Change'),
              date: t('Common:Time'),
            },

            contents: events.map(({ txhash, type, amount, timestamp }) => ({
              link: getLink!({ q: 'tx', v: txhash }),
              hash: format.truncate(txhash, [6, 6]),
              type: t('Post:Staking:' + type),
              display: format.display(amount),
              date: format.date(timestamp),
            })),
          },
        }

  return { ...response, title: t('Page:Staking:Event log'), ui }
}
