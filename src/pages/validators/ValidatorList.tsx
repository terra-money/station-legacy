import React, { CSSProperties } from 'react'
import { StakingUI } from '@terra-money/use-station'
import { ValidatorListHeading } from '@terra-money/use-station'
import Card from '../../components/Card'
import Icon from '../../components/Icon'
import FlexTable from '../../components/FlexTable'
import renderItem from './renderItem'

type Attr = { align?: 'center' | 'right'; style: CSSProperties }

const ValidatorList = ({ sorter, headings, contents }: StakingUI) => {
  const { rank, moniker, votingPower, commission } = headings
  const { delegationReturn, uptime, myDelegation } = headings

  const Columns: [ValidatorListHeading | undefined, Attr][] = [
    [rank, { style: { width: 60 } }],
    [moniker, { style: { width: 240 } }],
    [votingPower, { align: 'right', style: { width: 120 } }],
    [commission, { align: 'right', style: { width: 100, textAlign: 'right' } }],
    [
      delegationReturn,
      { align: 'right', style: { width: 100, textAlign: 'right' } }
    ],
    [uptime, { align: 'right', style: { width: 80 } }],
    [undefined, { style: { width: 20 } }],
    [myDelegation, { align: 'right', style: { width: 200 } }]
  ]

  return (
    <Card>
      <FlexTable
        head={Columns.map(([heading]) => {
          const { current, set } = sorter
          const selected = current.prop === heading?.sorter?.prop
          const title = heading?.title ?? ''
          const icon =
            selected && current.asc ? 'arrow_drop_up' : 'arrow_drop_down'

          const handleClick = () => {
            const asc = selected ? !current.asc : false
            heading?.sorter && set(heading?.sorter, asc)
          }

          const button = (
            <button onClick={handleClick} className="flex">
              {title}
              <Icon name={icon} style={{ opacity: selected ? 1 : 0.3 }} />
            </button>
          )

          return !heading?.sorter ? title : button
        })}
        body={contents.map(content => renderItem(content))}
        attrs={Columns.map(([, attr]) => attr)}
        scrollX
        hover
      />
    </Card>
  )
}

export default ValidatorList
