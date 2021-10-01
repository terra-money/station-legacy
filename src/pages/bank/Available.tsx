import c from 'classnames'
import { AvailableItem } from '../../lib'
import { useApp } from '../../hooks'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import AmountCard from './AmountCard'
import Send from '../../post/Send'
import s from './Available.module.scss'

interface Props extends AvailableItem {
  buttonLabel: string
}

const Available = (item: Props) => {
  const { denom, token, buttonLabel } = item
  const { modal } = useApp()

  const buttonAttrs = {
    onClick: () => modal.open(<Send denom={denom || token || ''} />),
    children: buttonLabel,
  }

  const renderButton = () => {
    const className = c('btn btn-primary btn-sm', s.button)
    return <ButtonWithAuth {...buttonAttrs} className={className} />
  }

  return (
    <AmountCard {...item} button={renderButton()} buttonAttrs={buttonAttrs} />
  )
}

export default Available
