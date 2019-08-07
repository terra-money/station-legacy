import React, { FC, RefObject } from 'react'
import c from 'classnames'

type Props = {
  name: string
  size?: number
  className?: string
  forwardRef?: RefObject<HTMLSpanElement>
}

const Icon: FC<Props> = ({ name, size, className, forwardRef, ...attrs }) => (
  <i
    {...attrs}
    className={c('material-icons', className)}
    style={{ fontSize: size, width: size }}
    ref={forwardRef}
  >
    {name}
  </i>
)

export default Icon
