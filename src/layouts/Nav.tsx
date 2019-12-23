import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import c from 'classnames'
import Icon from '../components/Icon'
import NavItem from './NavItem'
import SelectLanguage from './SelectLanguage'
import SelectChain from './SelectChain'
import { ReactComponent as TerraStation } from '../helpers/TerraStation.svg'
import s from './Nav.module.scss'

const Nav = ({ pathname }: { pathname: string }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  const menu = [
    { name: t('Dashboard'), to: '/', icon: 'dashboard' },
    { name: t('Bank'), to: '/bank', icon: 'account_balance' },
    { name: t('Transactions'), to: '/transactions', icon: 'swap_horiz' },
    { name: t('Staking'), to: '/staking', icon: 'layers' },
    { name: t('Market'), to: '/market', icon: 'timeline' },
    { name: t('Governance'), to: '/governance', icon: 'how_to_vote' }
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
          <SelectLanguage />
          <SelectChain onChangeChain={close} />
        </footer>
      </section>
    </nav>
  )
}

export default Nav
