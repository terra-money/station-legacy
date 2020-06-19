import React from 'react'
import c from 'classnames'
import { NavLink, useLocation } from 'react-router-dom'
import Icon from '../components/Icon'
import s from './NavItem.module.scss'

interface Props {
  name: string
  to: string
  icon: string
  submenu?: string[]
}

const NavItem = ({ name, to, icon, submenu }: Props) => {
  const { pathname } = useLocation()
  const active =
    to === '/'
      ? pathname === '/'
      : pathname.startsWith(to) ||
        !!submenu?.some((p) => pathname.startsWith(p))

  return (
    <NavLink to={to} className={c(s.link, active && s.active)}>
      <span>
        <Icon name={icon} className="desktop-large" />
        {name}
      </span>
    </NavLink>
  )
}

export default NavItem
