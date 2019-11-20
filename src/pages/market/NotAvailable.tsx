import React, { FC } from 'react'
import Icon from '../../components/Icon'
import s from './NotAvailable.module.scss'

const NotAvailable: FC<{ q?: string }> = ({ q, children }) => (
  <article className={s.component}>
    <Icon name="info_outline" size={48} />
    <p>{children ?? `${q} is not available.`}</p>
  </article>
)

export default NotAvailable
