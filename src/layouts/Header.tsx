import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import c from 'classnames'
import { useApp, useAuth } from '../hooks'
import Icon from '../components/Icon'
import s from './Header.module.scss'

const Header = ({ className }: { className: string }) => {
  const { t } = useTranslation()
  const { authModal, refresh, goBack } = useApp()
  const { name, address, signout } = useAuth()

  return (
    <header className={c(s.header, className)}>
      <div className={s.container}>
        <div className={s.user}>
          {!address ? (
            <button
              onClick={authModal.open}
              className={c('btn btn-primary btn-sm', s.button)}
            >
              {t('Sign in')}
            </button>
          ) : (
            <>
              <Icon name="account_circle" />
              <span className={s.username}>{name || address}</span>
            </>
          )}
        </div>

        <section
          className={c(
            'btn-icon-group',
            s.actions,
            !address && 'desktop-large'
          )}
        >
          {goBack && (
            <Link to={goBack} className="btn-icon">
              <Icon name="arrow_back" size={20} />
            </Link>
          )}

          <button onClick={refresh} className="btn-icon">
            <Icon name="refresh" size={20} />
          </button>

          {address && (
            <button onClick={signout} className="btn-icon">
              <Icon name="exit_to_app" size={20} />
            </button>
          )}
        </section>
      </div>
    </header>
  )
}

export default Header
