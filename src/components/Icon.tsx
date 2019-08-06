import React, { FC } from 'react'
import c from 'classnames'

type Props = { name: string; size?: number; className?: string }
const Icon: FC<Props> = ({ name, size, className, ...attrs }) => (
  <i
    {...attrs}
    className={c('material-icons', className)}
    style={{ fontSize: size, width: size }}
  >
    {name}
  </i>
)

export default Icon
