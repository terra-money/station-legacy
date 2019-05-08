import React, { FC, ReactNode } from 'react'
import c from 'classnames'

type Props = {
  title?: ReactNode
  footer?: ReactNode
  actions?: ReactNode

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
  const { title, footer, children, actions, bordered, bgHeader, small } = props
  const { className, headerClassName, bodyClassName, style } = props
  return (
    <article
      className={c('card', small && 'card-small', className)}
      style={style}
    >
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
        </header>
      )}

      <section className={c('card-body', bodyClassName)}>{children}</section>
      {footer && <footer className="card-footer">{footer}</footer>}
    </article>
  )
}

export default Card
