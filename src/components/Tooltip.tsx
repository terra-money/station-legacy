import React, { FC, ReactNode } from 'react'
import c from 'classnames'
import s from './Tooltip.module.scss'

export type Props = {
  bottom?: boolean
  large?: boolean
  className?: string
  contentClassName?: string
  style?: object
  contentStyle?: object
  content: ReactNode
}

const Tooltip: FC<Props> = ({ bottom, large, content, ...props }) => {
  const { className, contentClassName, style, contentStyle } = props

  return (
    <div
      className={c(s.container, bottom ? s.bottom : s.top, className)}
      style={style}
    >
      <div
        className={c(s.content, large && s.large, contentClassName)}
        style={contentStyle}
      >
        {content}
      </div>
    </div>
  )
}

export default Tooltip
