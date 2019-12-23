import React, { CSSProperties, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { path, equals } from 'ramda'
import { gt, plus, sum } from '../../api/math'
import FlexTable from '../../components/FlexTable'
import Icon from '../../components/Icon'
import renderItem from './ValidatorItem'

type Attr = { align?: 'center' | 'right'; style: CSSProperties }
type Sorter = { prop: string[]; isString?: boolean }
const DefaultSorter: Sorter = { prop: ['stakingReturn'] }
const Columns: [string, Attr, Sorter?][] = [
  ['Rank', { style: { width: 60 } }],
  [
    'Moniker',
    { style: { width: 240 } },
    { prop: ['description', 'moniker'], isString: true }
  ],
  [
    'Voting power',
    { align: 'right', style: { width: 120 } },
    { prop: ['votingPower', 'weight'] }
  ],
  [
    'Validator commission',
    { align: 'right', style: { width: 100, textAlign: 'right' } },
    { prop: ['commissionInfo', 'rate'] }
  ],
  [
    'Delegation return',
    { align: 'right', style: { width: 100, textAlign: 'right' } },
    { prop: ['stakingReturn'] }
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
  const { t } = useTranslation()

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
            {t(h)}
            <Icon name={icon} style={{ opacity: isPropSelected ? 1 : 0.3 }} />
          </button>
        )

        return !s ? t(h) : button
      })}
      body={validators
        .filter(v => {
          const delegated = v.myDelegation && gt(v.myDelegation, 0)
          const hidden = v.status === 'jailed' && !delegated
          return !hidden
        })
        .sort((validatorA, validatorB) => {
          const a: string = String(path(prop, validatorA) || 0)
          const b: string = String(path(prop, validatorB) || 0)
          const c = asc ? 1 : -1
          const compareString = c * (a.toLowerCase() > b.toLowerCase() ? 1 : -1)
          const compareNumber = c * (gt(a, b) ? 1 : -1)
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
