import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import c from 'classnames'
import { useApp } from '../hooks'
import Icon from '../components/Icon'
import NavItem from './NavItem'
import NavFooter from './NavFooter'
import { ReactComponent as TerraStation } from '../helpers/TerraStation.svg'
import s from './Nav.module.scss'

const Nav = ({ pathname }: { pathname: string }) => {
  const { key } = useApp()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  const menu = [
    { name: 'Dashboard', to: '/', icon: 'dashboard' },
    { name: 'Bank', to: '/bank', icon: 'account_balance' },
    { name: 'Transactions', to: '/transactions', icon: 'swap_horiz' },
    { name: 'Staking', to: '/staking', icon: 'layers' },
    { name: 'Market', to: '/market', icon: 'timeline' },
    { name: 'Governance', to: '/governance', icon: 'how_to_vote' }
  ]

  /* Close on change path (Android) */
  useEffect(() => {
    close()
  }, [pathname])

  return (
    <nav className={s.nav}>
      <header className={s.header}>
        <Link to="/" className={s.logo}>
          <TerraStation />
        </Link>

        <button onClick={toggle} className={s.toggle}>
          <Icon name={isOpen ? 'close' : 'menu'} />
        </button>
      </header>

      <section className={c(s.main, isOpen && s.open)}>
        <ul className={s.menu}>
          {menu.map(item => (
            <li className={s.item} key={item.name}>
              <NavItem {...item} />
            </li>
          ))}
        </ul>

        <NavFooter onChangeChain={close} key={key} />
      </section>
    </nav>
  )
}

export default Nav
