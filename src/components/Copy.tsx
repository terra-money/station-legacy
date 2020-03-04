import React, { useState, ReactNode } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import c from 'classnames'
import { useText } from '@terra-money/use-station'
import Icon from './Icon'
import { Tooltip } from './Pop'
import tooltipStyle from './Pop.module.scss'
import s from './Copy.module.scss'

type Props = {
  classNames?: { container?: string; text?: string; button?: string }
  text: string
  noLabel?: boolean
  children?: ReactNode
}

const Copy = ({ classNames = {}, text, noLabel, children }: Props) => {
  const { COPY, COPIED } = useText()
  const [copied, setCopied] = useState(false)

  const showTooltip = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const attrs = { text, onCopy: showTooltip }

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
            placement="top"
            content={COPIED}
            className={c(tooltipStyle.tooltip, s.tooltip)}
          />
        )}
      </section>
    </div>
  )
}

export default Copy
