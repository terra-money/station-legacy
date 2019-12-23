import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import c from 'classnames'
import BigNumber from 'bignumber.js'
import Amount from '../../components/Amount'
import FlexTable from '../../components/FlexTable'
import StakingChart from './StakingChart'

const tabs: Tab[] = [
  { label: 'Delegated', key: 'amountDelegated' },
  { label: 'Rewards', key: 'totalReward' }
]

type Props = { myDelegations: StakingDelegation[] }
const MyDelegations = ({ myDelegations }: Props) => {
  const { t } = useTranslation()

  /* Tab */
  const [currentTab, setCurrentTab] = useState<Tab>(tabs[0])
  const renderTab = (tab: Tab) => {
    const { label, key } = tab
    const badgeStyle = key === currentTab.key ? 'badge-primary' : 'badge-light'
    const onClick = () => setCurrentTab(tab)

    return (
      <button onClick={onClick} className={c('badge', badgeStyle)} key={key}>
        {t(label)}
      </button>
    )
  }

  /* Table */
  const getRow = (d: StakingDelegation) => [
    <Link to={`/validator/${d.validatorAddress}`}>{d.validatorName}</Link>,
    <Amount fontSize={16}>{d.amountDelegated}</Amount>,
    <Amount fontSize={16} estimated>
      {d.totalReward}
    </Amount>
  ]

  /* Sort */
  const list = myDelegations.sort(compareWith(currentTab.key))

  return (
    <div className="row">
      <div className="col col-6">
        <StakingChart
          list={list}
          currentTab={currentTab}
          renderTabs={() => tabs.map(renderTab)}
        />
      </div>
      <div className="col col-6">
        <FlexTable
          attrs={[{}, { align: 'right' }, { align: 'right' }]}
          head={[t('Validator'), t('Delegated'), t('Rewards')]}
          body={list.map(getRow)}
          height={270}
          borderless
        />
      </div>
    </div>
  )
}

export default MyDelegations

/* helpers */
const compareWith = (key: Tab['key']) => {
  return (a: StakingDelegation, b: StakingDelegation) =>
    new BigNumber(b[key] || 0).minus(a[key] || 0).toNumber()
}
