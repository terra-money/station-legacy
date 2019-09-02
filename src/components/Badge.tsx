import React, { FC, HTMLAttributes } from 'react'
import c from 'classnames'

interface Props extends HTMLAttributes<HTMLSpanElement> {
  active?: boolean
  light?: boolean
  small?: boolean
}

const Badge: FC<Props> = ({ active, light, small, children, ...attrs }) => (
  <span
    className={c(
      'badge',
      active && 'badge-primary',
      light && 'badge-light',
      small && 'badge-small',
      attrs.className
    )}
    style={attrs.style}
  >
    {children}
  </span>
)

export default Badge
