import React from 'react'
import { useExtension } from './useExtension'
import Icon from '../components/Icon'
import s from './Connect.module.scss'

const Connect = () => {
  const { connect } = useExtension()
  const { list, allow } = connect
  const [origin] = list

  return !origin ? null : (
    <article className={s.component}>
      <Icon name="account_balance_wallet" size={48} />
      <h1>Allow access to wallet</h1>
      <p>{origin} wants to access your wallet</p>

      <footer className={s.footer}>
        <button className="btn btn-primary" onClick={() => allow(origin)}>
          Allow
        </button>
        <button className="btn btn-danger" onClick={() => allow(origin, false)}>
          Deny
        </button>
      </footer>
    </article>
  )
}

export default Connect
