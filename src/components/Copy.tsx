import React, { useState, ReactNode } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import c from 'classnames'
import { useText } from '@terra-money/use-station'
import Icon from './Icon'
import { Tooltip } from './Pop'
import tooltipStyle from './Pop.module.scss'
import s from './Copy.module.scss'

interface Payload {
  children: ReactNode
  tooltip: string
  clicked: boolean
  onClick: () => void
}

interface Props {
  classNames?: { container?: string; text?: string; button?: string }
  text: string
  placement?: 'top' | 'bottom'
  noLabel?: boolean
  payload?: Payload
  children?: ReactNode
}

const DURATION = 1500

const Copy = ({ classNames = {}, text, noLabel, payload, ...props }: Props) => {
  const { children, placement = 'top' } = props
  const { COPY, COPIED } = useText()
  const [copied, setCopied] = useState(false)

  const showTooltip = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), DURATION)
  }

  const attrs = { text, onCopy: showTooltip }

  const renderPayload = ({ children, tooltip, clicked, onClick }: Payload) => (
    <section className={s.wrapper}>
      <button className={classNames.button} onClick={onClick} type="button">
        {children}
      </button>

      {clicked && (
        <Tooltip
          placement={placement}
          content={tooltip}
          className={c(tooltipStyle.tooltip, s.tooltip)}
          width={240}
        />
      )}
    </section>
  )

  return (
    <div className={classNames.container}>
      {children && (
        <CopyToClipboard {...attrs}>
          <button className={classNames.text}>{children}</button>
        </CopyToClipboard>
      )}

      <section className={s.wrapper}>
        <CopyToClipboard {...attrs}>
          <button className={classNames.button} type="button">
            <Icon name="filter_none" size={12} />
            {!noLabel && COPY}
          </button>
        </CopyToClipboard>

        {copied && (
          <Tooltip
            placement={placement}
            content={COPIED}
            className={c(tooltipStyle.tooltip, s.tooltip, s[placement])}
          />
        )}
      </section>

      {payload && renderPayload(payload)}
    </div>
  )
}

export default Copy
