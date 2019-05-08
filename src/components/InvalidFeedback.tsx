import React from 'react'
import c from 'classnames'
import Icon from './Icon'

type Props = { tooltip?: boolean; children: string }
const InvalidFeedback = ({ tooltip, children }: Props) =>
  children ? (
    <p className={c('invalid-feedback', tooltip && 'tooltip')}>
      <Icon name="error" />
      <span>{children}</span>
    </p>
  ) : null

export default InvalidFeedback
