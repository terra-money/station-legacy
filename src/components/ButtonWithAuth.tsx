import React, { ButtonHTMLAttributes } from 'react'
import c from 'classnames'
import { useAuth, useText } from '@terra-money/use-station'
import Pop from './Pop'
import s from './ButtonWithName.module.scss'

type Props = { placement?: 'top' | 'bottom' }
type Attrs = ButtonHTMLAttributes<HTMLButtonElement>

/* Show tooltip if user can't use this button */
const ButtonWithAuth = ({ placement = 'top', ...attrs }: Props & Attrs) => {
  const { user } = useAuth()
  const { WITH_AUTH } = useText()

  return user?.name || user?.ledger ? (
    <button {...attrs} />
  ) : (
    <Pop
      type="tooltip"
      placement={placement}
      content={<p className={s.tooltip}>{WITH_AUTH}</p>}
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

export default ButtonWithAuth
