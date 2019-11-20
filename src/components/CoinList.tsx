import React from 'react'
import Coin from './Coin'

const CoinList = ({ list }: { list: Coin[] }) => {
  const renderItem = (d: Coin, i: number) => (
    <li key={i}>
      <Coin {...d} />
    </li>
  )

  return <ul>{list.map(renderItem)}</ul>
}

export default CoinList
