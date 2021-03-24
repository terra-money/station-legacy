import React, { useState } from 'react'
import { DepositorsTable, DepositorContent } from '../use-station/src'
import { TableUI } from '../use-station/src'
import { useDepositors } from '../use-station/src'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Card from '../components/Card'
import Table from '../components/Table'
import Displays from '../components/Displays'
import Voter from '../pages/proposal/Voter'

const Depositors = ({ id }: { id: string }) => {
  const [page, setPage] = useState(1)
  const { error, title, ui } = useDepositors(id, { page })

  const renderHeadings = (headings: DepositorsTable['headings']) => {
    const { depositor, displays } = headings
    return (
      <tr>
        <th>{depositor}</th>
        <th>{displays}</th>
      </tr>
    )
  }

  const renderRow = (
    { depositor, displays }: DepositorContent,
    index: number
  ) => {
    return (
      <tr key={index}>
        <td>
          <Voter voter={depositor} />
        </td>

        <td>
          <Displays list={displays} />
        </td>
      </tr>
    )
  }

  const render = ({ pagination, card, table }: TableUI<DepositorsTable>) => (
    <Pagination
      {...pagination}
      count={table ? table.contents.length : 0}
      action={setPage}
      empty={card?.content}
    >
      {table && (
        <Table>
          <thead>{renderHeadings(table.headings)}</thead>
          <tbody>{table.contents.map(renderRow)}</tbody>
        </Table>
      )}
    </Pagination>
  )

  return (
    <Card title={title} bordered fixedHeight>
      {error ? <ErrorComponent error={error} /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

export default Depositors
