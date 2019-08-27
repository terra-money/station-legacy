import React, { useState, useEffect } from 'react'
import ledger from '../../cosmos/ledger'
import Icon from '../../components/Icon'
import { useAuth } from '../../hooks'
import ModalContent from '../../components/ModalContent'
import ProgressCircle from '../../components/ProgressCircle'
import useModalActions from './useModalActions'
import s from './Hardware.module.scss'

const Hardware = () => {
  const auth = useAuth()
  const modalActions = useModalActions()
  const [error, setError] = useState()

  const signin = async () => {
    setError(null)

    try {
      const address = await ledger.getTerraAddress()
      auth.signin({ address, withLedger: true })
    } catch (error) {
      setError(error)
    }
  }

  /* effect: onMount */
  useEffect(() => {
    signin()
    // eslint-disable-next-line
  }, [])

  return (
    <ModalContent {...modalActions}>
      <article>
        <h1 className={s.title}>Sign In</h1>

        <section className={s.content}>
          <Icon name="usb" size={64} />
          <p>
            Please plug in your
            <br />
            Ledger Wallet
          </p>
        </section>

        <footer className="text-center">
          {!error ? (
            <ProgressCircle />
          ) : (
            <>
              <p>
                <button onClick={signin} className="btn btn-primary btn-sm">
                  Retry
                </button>
              </p>
              <p>
                <small>{error.message}</small>
              </p>
            </>
          )}
        </footer>
      </article>
    </ModalContent>
  )
}

export default Hardware
