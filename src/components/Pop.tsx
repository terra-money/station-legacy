import React, { ReactNode } from 'react'
import c from 'classnames'
import s from './Pop.module.scss'

type Tooltip = {
  placement: 'top' | 'bottom'
  width?: string | number
  className?: string
  content: ReactNode
}

export const Tooltip = ({ placement, width, content, className }: Tooltip) => (
  <div className={c(s.tooltip, s[placement], className)} style={{ width }}>
    <div className={c(s.content)}>{content}</div>
  </div>
)

type Pop = {
  type: 'pop' | 'tooltip'
  className?: string
  children: () => ReactNode
}

const Pop = ({ className, children, ...tooltip }: Tooltip & Pop) => (
  <div className={c(s.container, className)}>
    {children()}
    <Tooltip className={s.tooltip} {...tooltip} />
  </div>
)

export default Pop
