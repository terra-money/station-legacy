import { ReactNode } from 'react'
import classNames from 'classnames'
import { HideSmallUI, NFTAvailableUI } from '../../lib'
import { isExtension } from '../../utils/env'
import { localSettings } from '../../utils/localStorage'
import Card from '../../components/Card'
import Checkbox from '../../components/Checkbox'
import NFTAvailable from './NFTAvailable'
import styles from './AvailableList.module.scss'

interface Props extends NFTAvailableUI {
  button?: ReactNode
  footer?: ReactNode
}

const NFTAvailableList = ({
  title,
  list,
  hideSmall,
  send,
  ...props
}: Props) => {
  const { button, footer } = props

  const content = list.map((item, i) => (
    <NFTAvailable {...item} buttonLabel="link_to_homepage" key={'nft-' + i} />
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
      noShadow={isExtension}
    >
      {!!list.length && (
        <section className={classNames(isExtension && styles.extension)}>
          {children}
        </section>
      )}

      {footer}
    </Card>
  )

  return <>{renderCard(content)}</>
}

export default NFTAvailableList
