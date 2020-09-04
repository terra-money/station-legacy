import React, { ReactNode } from 'react'
import { AvailableUI } from '@terra-money/use-station'
import { isExtension } from '../../utils/env'
import { localSettings } from '../../utils/localStorage'
import Card from '../../components/Card'
import Checkbox from '../../components/Checkbox'
import Available from './Available'

const AvailableList = ({ title, list, hideSmall, send }: AvailableUI) => {
  const toggle = () => {
    localSettings.set({ hideSmallBalances: !hideSmall.checked })
    hideSmall.toggle()
  }

  const checkbox = (
    <Checkbox onClick={toggle} checked={hideSmall.checked}>
      {hideSmall.label}
    </Checkbox>
  )

  const content = list.map((item, i) => (
    <Available {...item} buttonLabel={send} key={i} />
  ))

  const renderCard = (children: ReactNode) => (
    <Card title={title} actions={checkbox}>
      {children}
    </Card>
  )

  return <>{isExtension ? content : renderCard(content)}</>
}

export default AvailableList
