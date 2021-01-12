import React, { useState } from 'react'
import { DepositorsTable, DepositorContent } from '../use-station/src'
import { TableUI } from '../use-station/src'
import { useDepositors, format } from '../use-station/src'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Card from '../components/Card'
import Table from '../components/Table'
import ExtLink from '../components/ExtLink'
import Displays from '../components/Displays'
import Voter from '../pages/proposal/Voter'

const Depositors = ({ id }: { id: string }) => {
  const [page, setPage] = useState(1)
  const { error, title, ui } = useDepositors(id, { page })

  const renderHeadings = (headings: DepositorsTable['headings']) => {
    const { depositor, displays, hash } = headings
    return (
      <tr>
        <th>{depositor}</th>
        <th>{displays}</th>
        <th className="text-right">{hash}</th>
      </tr>
    )
  }

  const renderRow = (
    { depositor, displays, hash }: DepositorContent,
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

        <td className="text-right">
          <ExtLink href={hash.link}>
            {format.truncate(hash.text, [14, 13])}
          </ExtLink>
        </td>
      </tr>
    )
  }

  const render = ({ pagination, card, table }: TableUI<DepositorsTable>) => (
    <Pagination {...pagination} action={setPage} empty={card?.content}>
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
      {error ? <ErrorComponent /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

export default Depositors
