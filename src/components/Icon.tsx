import React from 'react'
import c from 'classnames'

type Props = { name: string; size?: number; className?: string }
const Icon = ({ name, size, className }: Props) => (
  <i
    className={c('material-icons', className)}
    style={{ fontSize: size, width: size }}
  >
    {name}
  </i>
)

export default Icon
