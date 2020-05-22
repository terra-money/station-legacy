import React from 'react'
import { ConfirmLedger as Props } from '@terra-money/use-station'
import ProgressCircle from '../components/ProgressCircle'
import Icon from '../components/Icon'
import Copy from '../components/Copy'
import s from './ConfirmLedger.module.scss'

const ConfirmLedger = ({ card, retry }: Props) => {
  const renderRetryMessage = (message: string) => {
    const [desc1, desc2, url] = message.split('\n')

    return (
      <>
        {desc1}
        <br />
        {desc2}
        <br />
        <Copy classNames={{ container: s.copy }} text={url} noLabel>
          {url}
        </Copy>
      </>
    )
  }

  return (
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

            <div className={s.message}>
              {retry.message.includes('chrome://')
                ? renderRetryMessage(retry.message)
                : retry.message}
            </div>
          </>
        )}
      </footer>
    </article>
  )
}

export default ConfirmLedger
