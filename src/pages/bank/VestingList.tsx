import React from 'react'
import Card from '../../components/Card'
import Icon from '../../components/Icon'
import Flex from '../../components/Flex'
import Pop from '../../components/Pop'
import Vesting from './Vesting'
import s from './VestingList.module.scss'

const TOOLTIP = `This displays your investment with Terra.
Vested Luna can be delegated in the meantime.`

const VestingList = ({ list }: { list: Vesting[] }) => (
  <Card
    title={
      <Pop
        type="tooltip"
        placement="top"
        content={<p className={s.tooltip}>{TOOLTIP}</p>}
      >
        {({ ref, iconRef, getAttrs }) => (
          <Flex {...getAttrs({})} forwardRef={ref}>
            Vesting
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
