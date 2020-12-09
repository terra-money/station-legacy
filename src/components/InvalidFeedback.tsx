import React from 'react'
import c from 'classnames'
import Icon from './Icon'

type Props = { tooltip?: boolean; className?: string; children: string }
const InvalidFeedback = ({ tooltip, className, children }: Props) =>
  children ? (
    <p className={c('invalid-feedback', tooltip && 'tooltip', className)}>
      <Icon name="error" />
      <span>{children}</span>
    </p>
  ) : null

export default InvalidFeedback
