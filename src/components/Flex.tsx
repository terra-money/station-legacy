import React, { FC, RefObject } from 'react'
import c from 'classnames'

type Attrs = { className?: string; forwardRef?: RefObject<HTMLElement> }
const Flex: FC<Attrs> = ({ className, forwardRef, ...attrs }) => (
  <span {...attrs} className={c('flex', className)} ref={forwardRef} />
)

export default Flex
