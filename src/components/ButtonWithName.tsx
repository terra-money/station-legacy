import React, { ButtonHTMLAttributes } from 'react'
import { useAuth } from '../hooks'
import Pop from './Pop'

type Props = { bottom?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>

const ButtonWithName = ({ bottom, ...attrs }: Props) => {
  const { name } = useAuth()
  const tooltip = {
    content: 'Please sign in with account or ledger to execute',
    contentStyle: { whiteSpace: 'nowrap' }
  }

  return name ? (
    <button {...attrs} />
  ) : (
    <Pop tooltip={{ ...tooltip, bottom }}>
      <button {...attrs} disabled />
    </Pop>
  )
}

export default ButtonWithName
