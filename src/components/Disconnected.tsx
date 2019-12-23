import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from './Icon'
import s from './Disconnected.module.scss'

const Disconnected = () => {
  const { t } = useTranslation()
  const [connected, setConnected] = useState(true)
  const onOffline = () => setConnected(false)
  const onOnline = () => setConnected(true)

  useEffect(() => {
    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)

    return () => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  return connected ? null : (
    <div className={s.overlay}>
      <article>
        <Icon name="signal_wifi_off" size={50} />
        <h1>{t('No internet connection')}</h1>
        <p>{t('Please check your internet connection and retry again.')}</p>
      </article>
    </div>
  )
}

export default Disconnected
