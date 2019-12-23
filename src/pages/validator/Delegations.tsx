import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Pagination from '../../components/Pagination'
import Finder from '../../components/Finder'
import Table from '../../components/Table'
import Amount from '../../components/Amount'

interface DelegationEvent {
  height: string
  type: string
  amount: Coin
  timestamp: string
}

type DelegationsEvents = Pagination & { events: DelegationEvent[] }

const Delegations = ({ address }: { address: string }) => {
  const { t } = useTranslation()
  const [page, setPage] = useState<string>('1')

  const renderHead = () => (
    <tr>
      <th>{t('Height')}</th>
      <th>{t('Type')}</th>
      <th className="text-right">{t('Change')}</th>
      <th className="text-right">{t('Time')}</th>
    </tr>
  )

  const renderEvent = (event: DelegationEvent, index: number) =>
    event && (
      <tr key={index}>
        <td>
          <Finder q="blocks">{event.height}</Finder>
        </td>
        <td>{t(event.type)}</td>
        <td className="text-right">
          <Amount>{event.amount.amount}</Amount>
        </td>
        <td className="text-right">{format.date(event.timestamp)}</td>
      </tr>
    )

  return (
    <WithRequest
      url={`/v1/staking/validators/${address}/delegations`}
      params={{ page }}
    >
      {({ events, ...pagination }: DelegationsEvents) => (
        <Pagination {...pagination} title="claim" action={setPage}>
          <Table>
            <thead>{renderHead()}</thead>
            <tbody>{events.map(renderEvent)}</tbody>
          </Table>
        </Pagination>
      )}
    </WithRequest>
  )
}

export default Delegations
