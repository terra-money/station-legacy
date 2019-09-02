import React, { FC, ReactNode } from 'react'
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
  bodyClassName?: string

  style?: object

  bordered?: boolean
  bgHeader?: boolean
  small?: boolean
}

const Card: FC<Props> = props => {
  const { title, footer, children, actions, onClick } = props
  const { className, headerClassName, bodyClassName, style } = props
  const { bordered, bgHeader, small } = props

  const main = (
    <>
      {title && (
        <header
          className={c(
            'card-header',
            bordered ? 'bordered' : bgHeader ? 'bg' : 'collapsed',
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

      <section className={c('card-body', bodyClassName)}>{children}</section>
    </>
  )

  return (
    <article
      className={c('card', small && 'card-small', className)}
      style={style}
    >
      {onClick ? (
        <button className="card-main" onClick={onClick}>
          {main}
        </button>
      ) : (
        <div className="card-main">{main}</div>
      )}
      {footer && <footer className="card-footer">{footer}</footer>}
    </article>
  )
}

export default Card
