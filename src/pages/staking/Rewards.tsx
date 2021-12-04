import { RewardsTable } from '../../lib'
import { format, is } from '../../utils'
import { useDenomTracePair } from '../../data/lcd/ibc'
import Table from '../../components/Table'
import Number from '../../components/Number'

const Rewards = ({ headings, contents }: RewardsTable) => {
  const denomPair = useDenomTracePair(contents.map(({ coin }) => coin.denom))

  return (
    <Table light small>
      <thead>
        <tr>
          <th>{headings['unit']}</th>
          <th className="text-right">{headings['value']}</th>
        </tr>
      </thead>

      <tbody>
        {contents.map(({ coin: { denom }, display }, index) => (
          <tr key={index}>
            <td>
              {format.denom(is.ibcDenom(denom) ? denomPair[denom] : denom)}
            </td>
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
