import React, { ReactNode } from 'react'
import { StakingPersonal, DisplayCoin } from '@terra-money/use-station'
import Card from '../../components/Card'
import Flex from '../../components/Flex'
import Icon from '../../components/Icon'
import Pop from '../../components/Pop'
import Number from '../../components/Number'
import Undelegations from './Undelegations'
import Rewards from './Rewards'
import s from './Columns.module.scss'

interface ColumnProps {
  title: string
  description?: {
    header: string
    contents: string[]
    footer: string
  }
  display: DisplayCoin
  tooltip?: ReactNode
  width?: number
  estimated?: boolean
}

const Column = (column: ColumnProps) => {
  const { title, description, display, tooltip, width, estimated } = column
  const desc = (
    <article className={s.rewardtip}>
      <h1>{description?.header}</h1>
      <ul>
        {description?.contents.map((content, index) => (
          <li key={index}>{content}</li>
        ))}
      </ul>
      <footer>{description?.footer}</footer>
    </article>
  )
  const heading = (
    <Flex>
      {title}
      {description && (
        <Pop type="tooltip" placement="bottom" width={380} content={desc}>
          {({ ref, getAttrs }) => (
            <Icon
              name="info"
              forwardRef={ref}
              {...getAttrs({ style: { marginLeft: 5 } })}
            />
          )}
        </Pop>
      )}
    </Flex>
  )

  const content = <div className={s.tooltip}>{tooltip}</div>
  const children = <Number fontSize={18} {...display} estimated={estimated} />

  return (
    <div className="col col-6-1280" key={title}>
      <Card title={heading} className={s.card} headerClassName={s.header} small>
        {tooltip ? (
          <Pop type="pop" placement="bottom" width={width} content={content}>
            {({ ref, iconRef, getAttrs }) => (
              <Flex {...getAttrs({})} forwardRef={ref}>
                {children}
                <Icon name="arrow_drop_down" forwardRef={iconRef} />
              </Flex>
            )}
          </Pop>
        ) : (
          children
        )}
      </Card>
    </div>
  )
}

const Columns = (props: StakingPersonal) => {
  const { available, delegated, undelegated, rewards } = props
  const tooltip = {
    u: undelegated?.table && <Undelegations {...undelegated.table} />,
    r: rewards?.table && <Rewards {...rewards.table} />,
  }

  return (
    <div className="row">
      {available && <Column {...available} />}
      {delegated && <Column {...delegated} />}
      {undelegated && (
        <Column {...undelegated} tooltip={tooltip.u} width={540} />
      )}
      {rewards && (
        <Column
          {...rewards}
          description={props.rewards.desc}
          tooltip={tooltip.r}
          estimated
        />
      )}
    </div>
  )
}

export default Columns
