import React from 'react'
import c from 'classnames'
import { AvailableItem } from '@terra-money/use-station'
import { useApp } from '../../hooks'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import AmountCard from './AmountCard'
import Send from '../../post/Send'
import s from './Available.module.scss'

interface Props extends AvailableItem {
  buttonLabel: string
}

const Available = ({ icon, denom, token, display, buttonLabel }: Props) => {
  const { modal } = useApp()

  const renderButton = () => {
    const openModal = () => modal.open(<Send denom={denom || token || ''} />)
    const className = c('btn btn-primary btn-sm', s.button)

    return (
      <ButtonWithAuth onClick={openModal} className={className}>
        {buttonLabel}
      </ButtonWithAuth>
    )
  }

  return <AmountCard icon={icon} {...display} button={renderButton()} />
}

export default Available
