import React from 'react'
import { MyActionsTable } from '@terra-money/use-station'
import Number from '../../components/Number'
import Table from '../../components/Table'

const DelegationTooltip = ({ headings, contents }: MyActionsTable) => {
  return (
    <Table light small>
      <thead>
        <tr>
          <th>{headings.action}</th>
          <th className="text-right">{headings.display}</th>
          <th className="text-right">{headings.date}</th>
        </tr>
      </thead>

      <tbody>
        {contents.map(({ action, display, date }, index) => (
          <tr key={index}>
            <td>{action}</td>
            <td className="text-right">
              <Number>{display.value}</Number>
            </td>
            <td className="text-right">{date}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default DelegationTooltip
