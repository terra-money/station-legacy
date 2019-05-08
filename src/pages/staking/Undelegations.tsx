import React from 'react'
import { format } from '../../utils'
import Table from '../../components/Table'
import Amount from '../../components/Amount'

type Props = { undelegations: Undelegation[] }

const Undelegations = ({ undelegations }: Props) => (
  <Table light small>
    <thead>
      <tr>
        <th>Validator</th>
        <th className="text-right">
          Amount <small>(Luna)</small>
        </th>
        <th className="text-right">Release time</th>
      </tr>
    </thead>

    <tbody>
      {undelegations.map((u, index) => (
        <tr key={index}>
          <td>{u.validatorName}</td>
          <td className="text-right">
            <Amount>{u.amount}</Amount>
          </td>
          <td className="text-right">{format.date(u.releaseTime)}</td>
        </tr>
      ))}
    </tbody>
  </Table>
)

export default Undelegations
