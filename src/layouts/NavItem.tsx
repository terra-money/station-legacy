import React from 'react'
import { NavLink } from 'react-router-dom'
import Icon from '../components/Icon'
import s from './NavItem.module.scss'

type Props = { name: string; to: string; icon: string }
const NavItem = ({ name, to, icon }: Props) => (
  <NavLink exact to={to} className={s.link} activeClassName={s.active}>
    <span>
      <Icon name={icon} className="desktop-large" />
      {name}
    </span>
  </NavLink>
)

export default NavItem
