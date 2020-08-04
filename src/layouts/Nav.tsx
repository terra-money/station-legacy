import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import c from 'classnames'
import { useMenu, ErrorBoundary, useConfig } from '@terra-money/use-station'
import { ReactComponent as TerraStation } from '../images/TerraStation.svg'
import Icon from '../components/Icon'
import NavItem from './NavItem'
import Guide from './Guide'
import Lang from './Lang'
import Chain from './Chain'
import Height from './Height'
import s from './Nav.module.scss'

const Nav = () => {
  const { pathname } = useLocation()
  const name = useMenu()
  const { chain } = useConfig()
  const isInvalidItem = (to: string) =>
    to === '/contracts' &&
    !['tequila', 'localterra'].includes(chain.current.key)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  // prettier-ignore
  const menu = [
    { name: name['Dashboard'],    to: '/',             icon: 'dashboard' },
    { name: name['Bank'],         to: '/bank',         icon: 'account_balance' },
    { name: name['Transactions'], to: '/transactions', icon: 'swap_horiz' },
    { name: name['Staking'],      to: '/staking',      icon: 'layers',      submenu: ['/validator'] },
    { name: name['Market'],       to: '/market',       icon: 'timeline' },
    { name: name['Governance'],   to: '/governance',   icon: 'how_to_vote', submenu: ['/proposal'] },
    { name: name['Contracts'],    to: '/contracts',    icon: 'device_hub' },
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
          {menu.map((item) =>
            isInvalidItem(item.to) ? null : (
              <li className={s.item} key={item.name}>
                <NavItem {...item} />
              </li>
            )
          )}
        </ul>

        <footer className={s.footer}>
          <section className={s.container}>
            <Guide />
            <Lang />
          </section>

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
