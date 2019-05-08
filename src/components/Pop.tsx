import React, { FC } from 'react'
import c from 'classnames'
import Tooltip, { Props as TooltipProps } from './Tooltip'
import s from './Pop.module.scss'

type Props = { className?: string; tooltip: TooltipProps }

const Pop: FC<Props> = ({ className, tooltip, children }) => (
  <div className={c(s.container, className)}>
    {children}
    <Tooltip className={s.tooltip} {...tooltip} />
  </div>
)

export default Pop
