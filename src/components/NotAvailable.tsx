import React, { FC } from 'react'
import Icon from './Icon'
import s from './NotAvailable.module.scss'

const NotAvailable: FC = ({ children }) => (
  <article className={s.component}>
    <Icon name="info_outline" size={48} />
    <p>{children}</p>
  </article>
)

export default NotAvailable
