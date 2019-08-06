import React, { ButtonHTMLAttributes } from 'react'
import { useAuth } from '../hooks'
import Pop from './Pop'
import s from './ButtonWithName.module.scss'

type Props = { bottom?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>

const ButtonWithName = ({ bottom, ...attrs }: Props) => {
  const { name } = useAuth()

  return name ? (
    <button {...attrs} />
  ) : (
    <Pop
      type="tooltip"
      placement="bottom"
      content={
        <p className={s.tooltip}>
          Please sign in with account or ledger to execute
        </p>
      }
    >
      <button {...attrs} disabled />
    </Pop>
  )
}

export default ButtonWithName
