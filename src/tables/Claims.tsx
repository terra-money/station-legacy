import React, { useState } from 'react'
import { ClaimsTable, ClaimContent } from '../use-station/src'
import { TableUI } from '../use-station/src'
import { useClaims, format } from '../use-station/src'
import ErrorComponent from '../components/ErrorComponent'
import Loading from '../components/Loading'
import Pagination from '../components/Pagination'
import Card from '../components/Card'
import Icon from '../components/Icon'
import Table from '../components/Table'
import ExtLink from '../components/ExtLink'
import Number from '../components/Number'
import s from './Claims.module.scss'

const Claims = ({ address }: { address: string }) => {
  const [page, setPage] = useState(1)
  const { error, title, ui } = useClaims(address, { page })

  const renderHeadings = (headings: ClaimsTable['headings']) => {
    const { hash, type, displays, date } = headings
    return (
      <tr>
        <th>{hash}</th>
        <th>{type}</th>
        <th className="text-right">{displays}</th>
        <th className="text-right">{date}</th>
      </tr>
    )
  }

  const renderRow = ({ link, hash, ...rest }: ClaimContent, index: number) => {
    const { type, displays, date } = rest
    return (
      <tr key={index}>
        <td>
          <ExtLink href={link}>{format.truncate(hash, [14, 13])}</ExtLink>
        </td>

        <td>{type}</td>

        <td className="text-right">
          <ul>
            {displays.map((display, index) => (
              <li key={index}>
                <Number {...display} />
              </li>
            ))}
          </ul>
        </td>

        <td className="text-right">{date}</td>
      </tr>
    )
  }

  const render = ({ pagination, card, table }: TableUI<ClaimsTable>) => {
    const empty = card && (
      <p className={s.empty}>
        <Icon name="info_outline" size={30} />
        {card.content}
      </p>
    )

    return (
      <Pagination
        {...pagination}
        count={table ? table.contents.length : 0}
        action={setPage}
        empty={empty}
      >
        {table && (
          <Table>
            <thead>{renderHeadings(table.headings)}</thead>
            <tbody>{table.contents.map(renderRow)}</tbody>
          </Table>
        )}
      </Pagination>
    )
  }

  return (
    <Card title={title} bordered>
      {error ? <ErrorComponent error={error} /> : ui ? render(ui) : <Loading />}
    </Card>
  )
}

export default Claims
