import React, { FC } from 'react'
import c from 'classnames'

const Flex: FC<{ className?: string }> = ({ className, ...attrs }) => (
  <div className={c('flex', className)} {...attrs} />
)

export default Flex
