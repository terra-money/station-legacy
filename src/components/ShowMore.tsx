import React from 'react'
import { Link } from 'react-router-dom'
import s from './ShowMore.module.scss'

const ShowMore = ({ to }: { to: string }) => (
  <Link to={to} className={s.link}>
    Show more
  </Link>
)

export default ShowMore
