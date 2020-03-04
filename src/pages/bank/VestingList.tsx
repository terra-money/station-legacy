import React from 'react'
import { VestingUI } from '@terra-money/use-station'
import Card from '../../components/Card'
import Icon from '../../components/Icon'
import Flex from '../../components/Flex'
import Pop from '../../components/Pop'
import Vesting from './Vesting'
import s from './VestingList.module.scss'

const VestingList = ({ title, desc, list }: VestingUI) => (
  <Card
    title={
      <Pop
        type="tooltip"
        placement="top"
        content={<p className={s.tooltip}>{desc}</p>}
      >
        {({ ref, iconRef, getAttrs }) => (
          <Flex {...getAttrs({})} forwardRef={ref}>
            {title}
            <Icon name="info" className={s.icon} forwardRef={iconRef} />
          </Flex>
        )}
      </Pop>
    }
  >
    {list.map((v, i) => (
      <Vesting {...v} key={i} />
    ))}
  </Card>
)

export default VestingList
