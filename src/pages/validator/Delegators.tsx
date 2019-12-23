import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Pagination from '../../components/Pagination'
import Finder from '../../components/Finder'
import Table from '../../components/Table'
import Amount from '../../components/Amount'
import { percent } from '../../api/math'

interface Delegator {
  address: string
  amount: string
  weight: string
}

type Delegators = Pagination & { delegators: Delegator[] }

const Delegators = ({ address }: { address: string }) => {
  const { t } = useTranslation()
  const [page, setPage] = useState<string>('1')

  const renderHead = () => (
    <tr>
      <th>{t('Account')}</th>
      <th className="text-right">{t('Amount')}</th>
      <th className="text-right">{t('Weight')}</th>
    </tr>
  )

  const renderDelegator = (delegator: Delegator, index: number) =>
    delegator && (
      <tr key={index}>
        <td>
          <Finder q="account" v={delegator.address}>
            {format.truncate(delegator.address, [6, 6])}
          </Finder>
        </td>
        <td className="text-right">
          <Amount>{delegator.amount}</Amount>
        </td>
        <td className="text-right">{percent(delegator.weight)}</td>
      </tr>
    )

  return (
    <WithRequest
      url={`/v1/staking/validators/${address}/delegators`}
      params={{ page }}
    >
      {({ delegators = [], ...pagination }: Delegators) => (
        <Pagination {...pagination} title="claim" action={setPage}>
          <Table>
            <thead>{renderHead()}</thead>
            <tbody>{delegators.map(renderDelegator)}</tbody>
          </Table>
        </Pagination>
      )}
    </WithRequest>
  )
}

export default Delegators
