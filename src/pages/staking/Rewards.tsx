import React from 'react'
import { useTranslation } from 'react-i18next'
import { format } from '../../utils'
import Table from '../../components/Table'
import Amount from '../../components/Amount'

type Props = { rewards: Reward[] }

const Rewards = ({ rewards }: Props) => {
  const { t } = useTranslation()

  return (
    <Table light small>
      <thead>
        <tr>
          <th>{t('Coin')}</th>
          <th className="text-right">{t('Amount')}</th>
        </tr>
      </thead>

      <tbody>
        {rewards.map((u, index) => (
          <tr key={index}>
            <td>{format.denom(u.denom)}</td>
            <td className="text-right">
              <Amount>{u.amount}</Amount>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default Rewards
