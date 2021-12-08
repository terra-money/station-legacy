import { RewardsTable } from '../../lib'
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
        {contents.map((display, index) => (
          <tr key={index}>
            <td>{display.unit}</td>
            <td className="text-right">
              <Number>{display.value}</Number>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default Rewards
