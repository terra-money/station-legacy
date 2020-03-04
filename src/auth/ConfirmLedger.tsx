import React from 'react'
import { ConfirmLedger as Props } from '@terra-money/use-station'
import ProgressCircle from '../components/ProgressCircle'
import Icon from '../components/Icon'
import s from './ConfirmLedger.module.scss'

const ConfirmLedger = ({ card, retry }: Props) => (
  <article>
    <h1 className={s.title}>{card.title}</h1>

    <section className={s.content}>
      <Icon name="usb" size={64} />
      <p className="pre-line">{card.content}</p>
    </section>

    <footer className="text-center">
      {!retry ? (
        <ProgressCircle />
      ) : (
        <>
          <p>
            <button {...retry.attrs} className="btn btn-primary btn-sm" />
          </p>
          <p>
            <small>{retry.message}</small>
          </p>
        </>
      )}
    </footer>
  </article>
)

export default ConfirmLedger
