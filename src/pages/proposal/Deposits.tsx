import React, { useState } from 'react'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Pagination from '../../components/Pagination'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Finder from '../../components/Finder'
import CoinList from '../../components/CoinList'
import ValidatorLink from './ValidatorLink'

interface Deposit {
  txhash: string
  deposit: Coin[]
  depositor: SimpleValidator
}

const Deposits = ({ id }: { id: string }) => {
  const [page, setPage] = useState('1')

  const renderHead = () => (
    <tr>
      <th>Depositer</th>
      <th>Amount</th>
      <th className="text-right">Tx</th>
    </tr>
  )

  const renderDeposit = (depositItem: Deposit, index: number) => {
    const { depositor, deposit, txhash } = depositItem
    return (
      <tr key={index}>
        <td>
          <ValidatorLink {...depositor} />
        </td>
        <td>
          <CoinList list={deposit} />
        </td>
        <td className="text-right">
          <Finder q="tx" v={txhash}>
            {format.truncate(txhash, [14, 13])}
          </Finder>
        </td>
      </tr>
    )
  }

  type Deposits = { deposits: Deposit[] }
  return (
    <Card title="Depositors" bordered fixedHeight>
      <WithRequest url={`/v1/gov/proposals/${id}/deposits`} params={{ page }}>
        {({ deposits, ...pagination }: Pagination & Deposits) => (
          <Pagination {...pagination} action={setPage} empty="No deposits yet.">
            <Table>
              <thead>{renderHead()}</thead>
              <tbody>{deposits.filter(Boolean).map(renderDeposit)}</tbody>
            </Table>
          </Pagination>
        )}
      </WithRequest>
    </Card>
  )
}

export default Deposits
