import React from 'react'
import Icon from '../../components/Icon'
import ModalContent from '../../components/ModalContent'
import useModalActions from './useModalActions'
import s from './Hardware.module.scss'

const Hardware = () => {
  const modalActions = useModalActions()
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
      </article>
    </ModalContent>
  )
}

export default Hardware
