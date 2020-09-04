import React from 'react'
import c from 'classnames'
import { DisplayCoin } from '@terra-money/use-station'
import { isExtension } from '../../utils/env'
import { useApp } from '../../hooks'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import AmountCard from './AmountCard'
import Send from '../../post/Send'
import s from './Available.module.scss'

interface Props {
  denom: string
  display: DisplayCoin
  buttonLabel: string
}

const Available = ({ denom, display, buttonLabel }: Props) => {
  const { modal } = useApp()

  const renderButton = () => {
    const openModal = () => modal.open(<Send denom={denom} />)
    const className = c('btn btn-primary btn-sm', s.button)

    return (
      <ButtonWithAuth onClick={openModal} className={className}>
        {buttonLabel}
      </ButtonWithAuth>
    )
  }

  return (
    <AmountCard
      {...display}
      button={isExtension ? undefined : renderButton()}
    />
  )
}

export default Available
