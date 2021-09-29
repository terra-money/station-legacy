import { CSSProperties } from 'react'
import { useHistory } from 'react-router-dom'
import { StakingUI } from '../../lib'
import { ValidatorListHeading } from '../../lib'
import useValidators from '../../hooks/useValidators'
import { useSearch } from '../../hooks'
import Card from '../../components/Card'
import Icon from '../../components/Icon'
import FlexTable from '../../components/FlexTable'
import renderItem from './renderItem'

type Attr = { align?: 'center' | 'right'; style: CSSProperties }

const ValidatorList = ({ sorter, headings, contents }: StakingUI) => {
  const { data: validators } = useValidators()
  const { rank, moniker, votingPower, selfDelegation, commission } = headings
  const { uptime, myDelegation } = headings
  const { replace } = useHistory()
  const [, getNextSearch] = useSearch()

  const Columns: [ValidatorListHeading | undefined, Attr][] = [
    [rank, { align: 'center', style: { width: 60, paddingRight: 20 } }],
    [moniker, { style: { width: 240 } }],
    [votingPower, { align: 'right', style: { width: 120 } }],
    [selfDelegation, { align: 'right', style: { width: 120 } }],
    [commission, { align: 'right', style: { width: 100, textAlign: 'right' } }],
    [uptime, { align: 'right', style: { width: 80 } }],
    [undefined, { style: { width: 20 } }],
    [myDelegation, { align: 'right', style: { width: 200 } }],
  ]

  return (
    <Card>
      <FlexTable
        head={Columns.map(([heading], index) => {
          const { current, set } = sorter
          const selected = current.prop === heading?.sorter?.prop
          const title = heading?.title ?? ''
          const icon =
            selected && current.asc ? 'arrow_drop_up' : 'arrow_drop_down'

          const handleClick = () => {
            const asc = selected ? !current.asc : false
            heading?.sorter && set(heading?.sorter, asc)

            const by = heading?.sorter?.prop ?? ''
            const sort = asc ? 'asc' : ''
            replace(getNextSearch(Object.entries({ by, sort })))
          }

          const button = (
            <button onClick={handleClick} className="flex">
              {title}
              <Icon name={icon} style={{ opacity: selected ? 1 : 0.3 }} />
            </button>
          )

          return heading?.sorter ? button : index ? title : ''
        })}
        body={contents.map((content) => renderItem(content, validators))}
        attrs={Columns.map(([, attr]) => attr)}
        scrollX
        hover
      />
    </Card>
  )
}

export default ValidatorList
