import React from 'react'
import Icon from '../../components/Icon'
import s from './NotAvailable.module.scss'

const NotAvailable = ({ q }: { q: string }) => (
  <article className={s.component}>
    <Icon name="info_outline" size={48} />
    <p>{q} is not available.</p>
  </article>
)

export default NotAvailable
