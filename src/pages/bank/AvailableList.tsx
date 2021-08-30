import React, { ReactNode } from 'react'
import { AvailableUI, HideSmallUI } from '../../lib'
import { localSettings } from '../../utils/localStorage'
import Card from '../../components/Card'
import Checkbox from '../../components/Checkbox'
import Available from './Available'
import styles from './AvailableList.module.scss'

interface Props extends AvailableUI {
  button?: ReactNode
  footer?: ReactNode
}

const AvailableList = ({ title, list, hideSmall, send, ...props }: Props) => {
  const { button, footer } = props

  const content = list.map((item, i) => (
    <Available {...item} buttonLabel={send} key={i} />
  ))

  const renderCheckbox = ({ toggle, checked, label }: HideSmallUI) => {
    const handleClick = () => {
      localSettings.set({ hideSmallBalances: !checked })
      toggle()
    }

    return (
      <Checkbox onClick={handleClick} checked={checked}>
        {label}
      </Checkbox>
    )
  }

  const renderTitle = () => {
    return (
      <div className={styles.header}>
        {title}
        {button}
      </div>
    )
  }

  const renderCard = (children: ReactNode) => (
    <Card
      title={renderTitle()}
      actions={hideSmall && renderCheckbox(hideSmall)}
    >
      {children}
      {footer}
    </Card>
  )

  return <>{renderCard(content)}</>
}

export default AvailableList
