import React, { useState } from 'react'
import { DelegatorsTable, DelegatorContent } from '../use-station/src'
import { TableUI } from '../use-station/src'
import { useDelegators, format } from '../use-station/src'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Card from '../components/Card'
import Table from '../components/Table'
import ExtLink from '../components/ExtLink'
import Number from '../components/Number'
import s from './Validator.module.scss'

const Delegators = ({ address }: { address: string }) => {
  const [page, setPage] = useState(1)
  const { error, title, ui } = useDelegators(address, { page })

  const renderHeadings = (headings: DelegatorsTable['headings']) => {
    const { address, display, weight } = headings
    return (
      <tr>
        <th>{address}</th>
        <th className="text-right">{display}</th>
        <th className="text-right">{weight}</th>
      </tr>
    )
  }

  const renderRow = ({ link, ...rest }: DelegatorContent, index: number) => {
    const { address, display, weight } = rest
    return (
      <tr key={index}>
        <td>
          <ExtLink href={link}>{format.truncate(address, [6, 6])}</ExtLink>
        </td>

        <td className="text-right">
          <Number>{display.value}</Number>
        </td>

        <td className="text-right">{weight}</td>
      </tr>
    )
  }

  const render = ({ pagination, card, table }: TableUI<DelegatorsTable>) => (
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
    <Card title={title} bodyClassName={s.delegator} bordered>
      {error ? <ErrorComponent error={error} /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

export default Delegators
