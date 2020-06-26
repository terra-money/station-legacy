import React, { useRef, useState, useEffect, FC, ReactNode } from 'react'
import c from 'classnames'
import Icon from './Icon'

type Props = {
  title?: ReactNode
  footer?: ReactNode
  actions?: ReactNode
  onClick?: () => void

  /* styles */
  className?: string
  headerClassName?: string
  mainClassName?: string
  bodyClassName?: string
  footerClassName?: string

  style?: object

  bordered?: boolean
  bgHeader?: boolean
  small?: boolean
  fixedHeight?: boolean
}

const Card: FC<Props> = (props) => {
  const { title, footer, children, actions, onClick } = props
  const { className, headerClassName, mainClassName } = props
  const { bodyClassName, footerClassName } = props
  const { bordered, bgHeader, small, fixedHeight, style } = props
  const shouldCollapse = !(bordered || bgHeader)

  const bodyRef = useRef<HTMLDivElement>(null)
  const [minHeight, setMinHeight] = useState(0)

  useEffect(() => {
    const fixHeight = () => {
      const { height } = bodyRef.current!.getBoundingClientRect()
      setMinHeight(height)
    }

    fixedHeight && fixHeight()
  })

  const main = (
    <>
      {title && (
        <header
          className={c(
            'card-header',
            bgHeader && 'bg',
            shouldCollapse && 'collapsed',
            headerClassName
          )}
        >
          {title}
          {actions && <section className="card-actions">{actions}</section>}
          {onClick && (
            <section className="card-actions">
              <div className="card-icon">
                <Icon name="chevron_right" />
              </div>
            </section>
          )}
        </header>
      )}

      <section
        className={c('card-body', bodyClassName)}
        style={{ minHeight }}
        ref={bodyRef}
      >
        {children}
      </section>
    </>
  )

  return (
    <article
      className={c(
        'card',
        small && 'card-small',
        bordered && 'bordered',
        className
      )}
      style={style}
    >
      {onClick ? (
        <button className={c('card-main', mainClassName)} onClick={onClick}>
          {main}
        </button>
      ) : (
        <div className={c('card-main', mainClassName)}>{main}</div>
      )}

      {footer && (
        <footer
          className={c(
            'card-footer',
            shouldCollapse && 'collapsed',
            footerClassName
          )}
        >
          {footer}
        </footer>
      )}
    </article>
  )
}

export default Card
