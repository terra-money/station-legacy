import React from 'react'
import { UndelegationsTable } from '@terra-money/use-station'
import Table from '../../components/Table'
import Number from '../../components/Number'

const Undelegations = ({ headings, contents }: UndelegationsTable) => {
  return (
    <Table light small>
      <thead>
        <tr>
          <th>{headings['name']}</th>
          <th className="text-right">{headings['display']}</th>
          <th className="text-right">{headings['date']}</th>
        </tr>
      </thead>

      <tbody>
        {contents.map((content, index) => (
          <tr key={index}>
            <td>{content['name']}</td>
            <td className="text-right">
              <Number>{content['display'].value}</Number>
            </td>
            <td className="text-right">{content['date']}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default Undelegations
