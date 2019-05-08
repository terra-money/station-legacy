import React from 'react'
import { format } from '../../utils'
import Table from '../../components/Table'
import Amount from '../../components/Amount'
import Card from '../../components/Card'

const Rewards = ({ title, list }: { title: string; list: Reward[] }) => (
  <Card title={title} bordered>
    {!list.length ? (
      `No data`
    ) : (
      <Table>
        <thead>
          <tr>
            <th>Coin</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {list.map(({ denom, amount }, index) => (
            <tr key={index}>
              <td>{format.denom(denom)}</td>
              <td className="text-right">
                <Amount>{amount}</Amount>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </Card>
)

export default Rewards
