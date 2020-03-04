import React from 'react'
import { AvailableUI } from '@terra-money/use-station'
import { localSettings } from '../../utils/localStorage'
import Card from '../../components/Card'
import Checkbox from '../../components/Checkbox'
import Available from './Available'

const AvailableList = ({ title, list, hideSmall, send }: AvailableUI) => {
  const toggle = () => {
    localSettings.set({ hideSmallBalances: !hideSmall.checked })
    hideSmall.toggle()
  }

  return (
    <Card
      title={title}
      actions={
        <Checkbox onClick={toggle} checked={hideSmall.checked}>
          {hideSmall.label}
        </Checkbox>
      }
    >
      {list.map((item, i) => (
        <Available {...item} buttonLabel={send} key={i} />
      ))}
    </Card>
  )
}

export default AvailableList
