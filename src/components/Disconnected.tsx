import React, { useState, useEffect } from 'react'
import { useInfo } from '@terra-money/use-station'
import Icon from './Icon'
import s from './Disconnected.module.scss'

const Disconnected = () => {
  const { DISCONNECTED } = useInfo()
  const { title, content } = DISCONNECTED

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
        <h1>{title}</h1>
        <p>{content}</p>
      </article>
    </div>
  )
}

export default Disconnected
