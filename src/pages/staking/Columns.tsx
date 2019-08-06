import React, { ReactNode } from 'react'
import c from 'classnames'
import { sum } from '../../api/math'
import Card from '../../components/Card'
import Amount from '../../components/Amount'
import Pop from '../../components/Pop'
import Icon from '../../components/Icon'
import Flex from '../../components/Flex'
import Undelegations from './Undelegations'
import Rewards from './Rewards'
import s from './Columns.module.scss'

type Column = {
  title: string
  value?: string
  tooltip?: ReactNode
  width?: number
  estimated?: boolean
}

const Columns = (props: Staking) => {
  const { undelegations, availableLuna, delegationTotal, rewards } = props

  const undelegationsAmount =
    undelegations && undelegations.length
      ? sum(undelegations.map(o => o.amount))
      : '0'

  const columns: Column[] = [
    {
      title: 'Available for delegation',
      value: availableLuna
    },
    {
      title: 'Delegated Assets',
      value: delegationTotal
    },
    {
      title: 'Undelegated Assets',
      value: undelegationsAmount,
      tooltip: undelegations && !!undelegations.length && (
        <Undelegations undelegations={undelegations} />
      ),
      width: 540
    },
    {
      title: 'Rewards',
      value: rewards && rewards.total,
      tooltip: rewards && !!rewards.denoms.length && (
        <Rewards rewards={rewards.denoms} />
      ),
      estimated: true
    }
  ]

  const renderColumn = (column: Column) => {
    const { title, value, tooltip, width, estimated } = column
    const content = (
      <Amount denom="uluna" fontSize={18} estimated={estimated}>
        {value}
      </Amount>
    )

    return (
      <div className={c('col', s.column)} key={title}>
        <Card title={title} className={s.card} headerClassName={s.header} small>
          {tooltip ? (
            <Pop
              type="pop"
              placement="bottom"
              width={width}
              content={<div className={s.tooltip}>{tooltip}</div>}
            >
              <Flex>
                {content}
                <Icon name="arrow_drop_down" />
              </Flex>
            </Pop>
          ) : (
            content
          )}
        </Card>
      </div>
    )
  }

  return <div className={c('row', s.row)}>{columns.map(renderColumn)}</div>
}

export default Columns
