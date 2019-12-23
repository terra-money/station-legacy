import React from 'react'
import { useTranslation } from 'react-i18next'
import { format } from '../../utils'
import Amount from '../../components/Amount'
import Table from '../../components/Table'

const DelegationTooltip = (v: Validator) => {
  const { myDelegation, myUndelegation = [] } = v
  const { t } = useTranslation()

  return (
    <Table light small>
      <thead>
        <tr>
          <th>{t('Action')}</th>
          <th className="text-right">
            {t('Amount')} <small>(Luna)</small>
          </th>
          <th className="text-right">{t('Release time')}</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{t('Delegated')}</td>
          <td className="text-right">
            <Amount>{myDelegation}</Amount>
          </td>
          <td className="text-right">-</td>
        </tr>

        {myUndelegation.map(({ amount, releaseTime }, index) => (
          <tr key={index}>
            <td>{t('Undelegated')}</td>
            <td className="text-right">
              <Amount>{amount}</Amount>
            </td>
            <td className="text-right">{format.date(releaseTime)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default DelegationTooltip
