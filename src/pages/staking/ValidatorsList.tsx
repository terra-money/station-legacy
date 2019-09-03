import React, { CSSProperties } from 'react'
import { gt, plus, sum } from '../../api/math'
import FlexTable from '../../components/FlexTable'
import renderItem from './ValidatorItem'

type Attr = { align?: 'center' | 'right'; style: CSSProperties }
const Columns: [string, Attr][] = [
  ['Rank', { style: { width: 60 } }],
  ['Moniker', { style: { width: 240 } }],
  ['Voting power', { align: 'right', style: { width: 120 } }],
  [
    'Validator commission',
    { align: 'right', style: { width: 100, textAlign: 'right' } }
  ],
  ['Uptime', { align: 'right', style: { width: 80 } }],
  ['', { style: { width: 20 } }],
  ['My delegation', { align: 'right', style: { width: 200 } }]
]

const ValidatorsList = (staking: Staking) => {
  const { validators, delegationTotal = '0', undelegations } = staking
  const undelegationTotal =
    undelegations && undelegations.length
      ? sum(undelegations.map(u => u.amount))
      : '0'

  return (
    <FlexTable
      head={Columns.map(([h]) => h)}
      body={validators
        .filter(v => {
          const delegated = v.myDelegation && gt(v.myDelegation, 0)
          const hidden = v.status === 'jailed' && !delegated
          return !hidden
        })
        .map((validator, index) =>
          renderItem({
            validator,
            rank: index + 1,
            total: plus(delegationTotal, undelegationTotal)
          })
        )}
      attrs={Columns.map(([, p]) => p)}
      scrollX
      hover
    />
  )
}

export default ValidatorsList
