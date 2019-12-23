import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const undelegationsAmount =
    undelegations && undelegations.length
      ? sum(undelegations.map(o => o.amount))
      : '0'

  const columns: Column[] = [
    {
      title: t('Available for delegation'),
      value: availableLuna
    },
    {
      title: t('Delegated assets'),
      value: delegationTotal
    },
    {
      title: t('Undelegated assets'),
      value: undelegationsAmount,
      tooltip: undelegations && !!undelegations.length && (
        <Undelegations undelegations={undelegations} />
      ),
      width: 540
    },
    {
      title: t('Rewards'),
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
      <div className="col col-6-1280" key={title}>
        <Card title={title} className={s.card} headerClassName={s.header} small>
          {tooltip ? (
            <Pop
              type="pop"
              placement="bottom"
              width={width}
              content={<div className={s.tooltip}>{tooltip}</div>}
            >
              {({ ref, iconRef, getAttrs }) => (
                <Flex {...getAttrs({})} forwardRef={ref}>
                  {content}
                  <Icon name="arrow_drop_down" forwardRef={iconRef} />
                </Flex>
              )}
            </Pop>
          ) : (
            content
          )}
        </Card>
      </div>
    )
  }

  return <div className="row">{columns.map(renderColumn)}</div>
}

export default Columns
