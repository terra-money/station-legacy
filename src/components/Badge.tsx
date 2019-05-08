import React, { FC } from 'react'
import c from 'classnames'

type Props = { active?: boolean; small?: boolean; className?: string }

const Badge: FC<Props> = ({ active, small, children, className }) => (
  <span
    className={c(
      'badge',
      active && 'badge-primary',
      small && 'badge-small',
      className
    )}
  >
    {children}
  </span>
)

export default Badge
