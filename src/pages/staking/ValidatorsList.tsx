import React, { CSSProperties, useState } from 'react'
import { path, equals } from 'ramda'
import { gt, plus, sum } from '../../api/math'
import FlexTable from '../../components/FlexTable'
import Icon from '../../components/Icon'
import renderItem from './ValidatorItem'

type Attr = { align?: 'center' | 'right'; style: CSSProperties }
type Sorter = { prop: string[]; isString?: boolean }
const DefaultSorter: Sorter = { prop: ['votingPower', 'weight'] }
const Columns: [string, Attr, Sorter?][] = [
  ['Rank', { style: { width: 60 } }],
  [
    'Moniker',
    { style: { width: 240 } },
    { prop: ['description', 'moniker'], isString: true }
  ],
  ['Voting power', { align: 'right', style: { width: 120 } }, DefaultSorter],
  [
    'Validator commission',
    { align: 'right', style: { width: 100, textAlign: 'right' } },
    { prop: ['commissionInfo', 'rate'] }
  ],
  ['Uptime', { align: 'right', style: { width: 80 } }, { prop: ['upTime'] }],
  ['', { style: { width: 20 } }],
  [
    'My delegation',
    { align: 'right', style: { width: 200 } },
    { prop: ['myDelegation'] }
  ]
]

const ValidatorsList = (staking: Staking) => {
  const { validators, delegationTotal = '0', undelegations } = staking
  const undelegationTotal =
    undelegations && undelegations.length
      ? sum(undelegations.map(u => u.amount))
      : '0'

  /* sort */
  const [asc, setAsc] = useState<boolean>(false)
  const [sorter, setSorter] = useState<Sorter>(DefaultSorter)
  const { prop, isString } = sorter

  return (
    <FlexTable
      head={Columns.map(([h, , s]) => {
        const isPropSelected = equals(sorter, s)
        const icon = isPropSelected && asc ? 'arrow_drop_up' : 'arrow_drop_down'

        const handleClick = () => {
          !isPropSelected && s && setSorter(s)
          setAsc(a => (isPropSelected ? !a : false))
        }

        const button = (
          <button onClick={handleClick} className="flex">
            {h}
            <Icon name={icon} style={{ opacity: isPropSelected ? 1 : 0.3 }} />
          </button>
        )

        return !s ? h : button
      })}
      body={validators
        .filter(v => {
          const delegated = v.myDelegation && gt(v.myDelegation, 0)
          const hidden = v.status === 'jailed' && !delegated
          return !hidden
        })
        .sort((validatorA, validatorB) => {
          const a: string = path(prop, validatorA) || '0'
          const b: string = path(prop, validatorB) || '0'
          const compareString = asc ? (a > b ? 1 : -1) : a > b ? -1 : 1
          const compareNumber = asc ? (gt(a, b) ? 1 : -1) : gt(a, b) ? -1 : 1
          return a === b ? 0 : isString ? compareString : compareNumber
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
