import React from 'react'
import { Link } from 'react-router-dom'
import c from 'classnames'
import { useAuth, useText, useConfig } from '@terra-money/use-station'
import { useApp } from '../hooks'
import Icon from '../components/Icon'
import ModalContent from '../components/ModalContent'
import Share from './Share'
import Preconfigured from './Preconfigured'
import s from './Header.module.scss'

const Header = ({ className }: { className: string }) => {
  const { user, signOut } = useAuth()
  const { SIGN_IN } = useText()
  const { goBack, refresh, authModal, modal } = useApp()
  const { chain } = useConfig()
  const isLocal = chain.current.key === 'localterra'

  const share = () =>
    modal.open(
      <ModalContent close={modal.close}>
        <Share />
      </ModalContent>
    )

  return (
    <header className={c(s.header, className)}>
      <div className={s.container}>
        <div className={s.user}>
          {!user ? (
            <button
              className={c('btn btn-primary btn-sm', s.button)}
              onClick={authModal.open}
            >
              {SIGN_IN}
            </button>
          ) : (
            <>
              <Icon name="account_circle" />
              <span className={s.username}>{user.name || user.address}</span>
            </>
          )}

          {isLocal && (
            <Preconfigured className={c('btn btn-sm', s.button, s.select)} />
          )}
        </div>

        <section
          className={c('btn-icon-group', s.actions, !user && 'desktop-large')}
        >
          {goBack && (
            <Link to={goBack} className="btn-icon">
              <Icon name="arrow_back" size={20} />
            </Link>
          )}

          <button className="btn-icon" onClick={refresh}>
            <Icon name="refresh" size={20} />
          </button>

          <button className="btn-icon" onClick={share}>
            <Icon name="share" size={20} />
          </button>

          {user && (
            <button onClick={signOut} className="btn-icon">
              <Icon name="exit_to_app" size={20} />
            </button>
          )}
        </section>
      </div>
    </header>
  )
}

export default Header
