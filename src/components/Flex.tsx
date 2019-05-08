import React, { FC } from 'react'
import c from 'classnames'

const Flex: FC<{ className?: string }> = ({ className, children }) => (
  <div className={c('flex', className)}>{children}</div>
)

export default Flex
