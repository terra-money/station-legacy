import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import c from 'classnames'
import { MyDelegations as Item } from '@terra-money/use-station'
import { MyDelegationsContent } from '@terra-money/use-station'
import Card from '../../components/Card'
import Number from '../../components/Number'
import FlexTable from '../../components/FlexTable'
import StakingChart from './StakingChart'

const MyDelegations = ({ list }: { list: Item[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const renderTab = ({ title }: Item, index: number) => {
    const badgeStyle = index === currentIndex ? 'badge-primary' : 'badge-light'
    const onClick = () => setCurrentIndex(index)

    return (
      <button onClick={onClick} className={c('badge', badgeStyle)} key={index}>
        {title}
      </button>
    )
  }

  /* Table */
  const getRow = (d: MyDelegationsContent) => [
    <Link to={`/validator/${d.address}`}>{d.name}</Link>,
    <Number fontSize={16}>{d.delegated.value}</Number>,
    <Number fontSize={16} estimated>
      {d.rewards.value}
    </Number>,
  ]

  const current = list[currentIndex]
  const { headings, contents } = current.table

  return (
    <Card>
      <div className="row">
        <div className="col col-6">
          <StakingChart item={current} renderTabs={() => list.map(renderTab)} />
        </div>
        <div className="col col-6">
          <FlexTable
            attrs={[{}, { align: 'right' }, { align: 'right' }]}
            head={[headings.name, headings.delegated, headings.rewards]}
            body={contents.map(getRow)}
            height={270}
            borderless
          />
        </div>
      </div>
    </Card>
  )
}

export default MyDelegations
