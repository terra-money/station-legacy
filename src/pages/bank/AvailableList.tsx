import React, { useState } from 'react'
import { gte } from '../../api/math'
import { localSettings } from '../../utils/localStorage'
import Card from '../../components/Card'
import Checkbox from '../../components/Checkbox'
import Available from './Available'

const AvailableList = ({ list }: { list: Balance[] }) => {
  const { hideSmallBalances = false } = localSettings.get()
  const [hide, setHide] = useState<boolean>(hideSmallBalances)

  const toggle = () => {
    localSettings.set({ hideSmallBalances: !hide })
    setHide(!hide)
  }

  return (
    <Card
      title="Available"
      actions={
        <Checkbox onClick={toggle} checked={hide}>
          Hide small balances
        </Checkbox>
      }
    >
      {list
        .filter(({ available }) => !hide || gte(available, '100000'))
        .map((a, i) => (
          <Available {...a} key={i} />
        ))}
    </Card>
  )
}

export default AvailableList
