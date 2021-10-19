import { DisplayCoin } from '../lib'
import Number from './Number'

interface Props {
  list?: DisplayCoin[]
  integer?: boolean
}

const Displays = ({ list = [], integer }: Props) => {
  const renderItem = (d: DisplayCoin, i: number) => (
    <li key={i}>
      <Number {...d} integer={integer} />
    </li>
  )

  return <ul>{list.map(renderItem)}</ul>
}

export default Displays
