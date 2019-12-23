import React, { useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import CopyToClipboard from 'react-copy-to-clipboard'
import c from 'classnames'
import Icon from './Icon'
import { Tooltip } from './Pop'
import tooltipStyle from './Pop.module.scss'
import s from './Copy.module.scss'

type Props = {
  classNames?: { container?: string; text?: string; button?: string }
  text: string
  buttonLabel?: string
  children?: ReactNode
}

const Copy = (props: Props) => {
  const { classNames = {}, text, buttonLabel, children } = props

  const { t } = useTranslation()
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

        {copied && (
          <Tooltip
            placement="top"
            content={t('Copied!')}
            className={c(tooltipStyle.tooltip, s.tooltip)}
          />
        )}
      </section>
    </div>
  )
}

export default Copy
