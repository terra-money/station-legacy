import React from 'react'
import { RewardsTable } from '@terra-money/use-station'
import Table from '../../components/Table'
import Number from '../../components/Number'

const Rewards = ({ headings, contents }: RewardsTable) => {
  return (
    <Table light small>
      <thead>
        <tr>
          <th>{headings['unit']}</th>
          <th className="text-right">{headings['value']}</th>
        </tr>
      </thead>

      <tbody>
        {contents.map((content, index) => (
          <tr key={index}>
            <td>{content['unit']}</td>
            <td className="text-right">
              <Number>{content['value']}</Number>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default Rewards
