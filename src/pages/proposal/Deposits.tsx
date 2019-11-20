import React, { useState } from 'react'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Pagination from '../../components/Pagination'
import Card from '../../components/Card'
import Table from '../../components/Table'
import Finder from '../../components/Finder'
import CoinList from '../../components/CoinList'

interface Deposit {
  txhash: string
  deposit: Coin[]
  depositor: string
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

  const renderDeposit = (deposit: Deposit, index: number) =>
    deposit && (
      <tr key={index}>
        <td>
          <Finder q="account" v={deposit.depositor}>
            {format.truncate(deposit.depositor, [7, 6])}
          </Finder>
        </td>
        <td>
          <CoinList list={deposit.deposit} />
        </td>
        <td className="text-right">
          <Finder q="tx" v={deposit.txhash}>
            {format.truncate(deposit.txhash, [14, 13])}
          </Finder>
        </td>
      </tr>
    )

  type Deposits = { deposits: Deposit[] }
  return (
    <Card title="Depositors" bordered fixedHeight>
      <WithRequest url={`/v1/gov/proposals/${id}/deposits`} params={{ page }}>
        {({ deposits, ...pagination }: Pagination & Deposits) => (
          <Pagination {...pagination} action={setPage} empty="No deposits yet.">
            <Table>
              <thead>{renderHead()}</thead>
              <tbody>{deposits.map(renderDeposit)}</tbody>
            </Table>
          </Pagination>
        )}
      </WithRequest>
    </Card>
  )
}

export default Deposits
