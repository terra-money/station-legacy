import { useState, useEffect } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import c from 'classnames'
import { Proposal } from '@terra-money/terra.js'
import { useMenu } from '../lib'
import { ReactComponent as TerraStation } from '../images/TerraStation.svg'
import { isExtension } from '../utils/env'
import { useExtension } from '../extension/useExtension'
import Icon from '../components/Icon'
import { ErrorBoundaryComponent } from '../components/ErrorBoundary'
import { useProposalStatusList } from '../data/lcd/gov'
import NavItem from './NavItem'
import Guide from './Guide'
import Lang from './Lang'
import Currency from './Currency'
import Chain from './Chain'
import Height from './Height'
import s from './Nav.module.scss'

const Nav = () => {
  const { pathname } = useLocation()
  const history = useHistory()
  const { goBack } = useExtension()
  const list = useProposalStatusList()
  const defaultProposalStatus = list[Proposal.Status.VOTING_PERIOD]

  /* Menu */
  const name = useMenu()

  /* mobile */
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  const menu = [
    {
      name: name['Dashboard'],
      to: '/',
      icon: 'dashboard',
    },
    {
      name: name['Wallet'],
      to: '/wallet',
      icon: 'account_balance_wallet',
    },
    {
      name: name['History'],
      to: '/history',
      icon: 'subject',
    },
    {
      name: name['Staking'],
      to: '/staking',
      icon: 'layers',
      submenu: ['/validator'],
    },
    {
      name: name['Swap'],
      to: '/swap',
      icon: 'timeline',
    },
    {
      name: name['Governance'],
      to: `/governance?status=${defaultProposalStatus.key}`,
      icon: 'how_to_vote',
      submenu: ['/proposal'],
    },
    {
      name: name['Contracts'],
      to: '/contracts',
      icon: 'device_hub',
    },
  ]

  /* Close on change path (Android) */
  useEffect(() => {
    close()
  }, [pathname])

  return isExtension ? (
    <nav className={c(s.nav, s.extension)}>
      <header className={s.header}>
        {['/', '/auth', '/connect', '/confirm'].includes(pathname) ? (
          <Link to="/" className={s.logo}>
            <TerraStation />
          </Link>
        ) : (
          <button
            onClick={() => (goBack ? goBack() : history.goBack())}
            className={s.logo}
          >
            <Icon name="arrow_back" size={20} />
          </button>
        )}

        <div className={s.footer}>
          <Chain />
          <Lang />
        </div>
      </header>
    </nav>
  ) : (
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
          {menu.map((item) => (
            <li className={s.item} key={item.name}>
              <NavItem {...item} />
            </li>
          ))}
        </ul>

        <footer className={s.footer}>
          <section className={s.container}>
            <Guide />
            <div className={s.config}>
              <Lang />
              <Currency />
            </div>
          </section>

          <section className={s.chain}>
            <Chain />
            <ErrorBoundaryComponent>
              <Height />
            </ErrorBoundaryComponent>
          </section>
        </footer>
      </section>
    </nav>
  )
}

export default Nav
