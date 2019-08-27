import React, { ButtonHTMLAttributes } from 'react'
import c from 'classnames'
import { useAuth } from '../hooks'
import Pop from './Pop'
import s from './ButtonWithName.module.scss'

type Props = { placement?: 'top' | 'bottom' }
type Attrs = ButtonHTMLAttributes<HTMLButtonElement>

const TOOLTIP = 'Please sign in with account or ledger to execute'
const ButtonWithName = ({ placement = 'top', ...attrs }: Props & Attrs) => {
  const { name, withLedger } = useAuth()

  return name || withLedger ? (
    <button {...attrs} />
  ) : (
    <Pop
      type="tooltip"
      placement={placement}
      content={<p className={s.tooltip}>{TOOLTIP}</p>}
    >
      {({ ref, getAttrs }) => {
        const className = c(s.wrapper, attrs.className, 'disabled')

        /* Use <span> because onMouseLeave doesn't work with disabled buttons */
        return (
          <span {...getAttrs({ className })} ref={ref}>
            {attrs.children}
          </span>
        )
      }}
    </Pop>
  )
}

export default ButtonWithName
