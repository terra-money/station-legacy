import React, { useState, ReactNode } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Icon from './Icon'
import { Tooltip } from './Pop'
import s from './Copy.module.scss'

type Props = {
  classNames?: { container?: string; text?: string; button?: string }
  text: string
  buttonLabel?: string
  children?: ReactNode
  tooltip?: ReactNode
}

const Copy = (props: Props) => {
  const { classNames = {}, text, buttonLabel, children, tooltip } = props
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
            {buttonLabel}
          </button>
        </CopyToClipboard>

        {copied && (tooltip || <Tooltip placement="top" content="Copied!" />)}
      </section>
    </div>
  )
}

export default Copy
