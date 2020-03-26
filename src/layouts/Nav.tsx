import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import c from 'classnames'
import { useMenu, ErrorBoundary } from '@terra-money/use-station'
import { ReactComponent as TerraStation } from '../images/TerraStation.svg'
import Icon from '../components/Icon'
import NavItem from './NavItem'
import Lang from './Lang'
import Chain from './Chain'
import Height from './Height'
import s from './Nav.module.scss'

const Nav = () => {
  const { pathname } = useLocation()
  const name = useMenu()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  const menu = [
    { name: name['Dashboard'], to: '/', icon: 'dashboard' },
    { name: name['Bank'], to: '/bank', icon: 'account_balance' },
    { name: name['Transactions'], to: '/transactions', icon: 'swap_horiz' },
    { name: name['Staking'], to: '/staking', icon: 'layers' },
    { name: name['Market'], to: '/market', icon: 'timeline' },
    { name: name['Governance'], to: '/governance', icon: 'how_to_vote' }
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

        <footer className={s.footer}>
          <Lang />
          <section className={s.chain}>
            <Chain />
            <ErrorBoundary>
              <Height />
            </ErrorBoundary>
          </section>
        </footer>
      </section>
    </nav>
  )
}

export default Nav
