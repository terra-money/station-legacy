import React, { ReactNode, useState } from 'react'
import c from 'classnames'
import s from './Pop.module.scss'

type Tooltip = {
  placement: 'top' | 'bottom'
  width?: string | number
  className?: string
  content: ReactNode
}

export const Tooltip = ({ placement, width, content, className }: Tooltip) => (
  <div className={c(s.tooltip, s[placement], className)} style={{ width }}>
    <div className={c(s.content)}>{content}</div>
  </div>
)

type Pop = {
  type: 'pop' | 'tooltip'
  children: (Params: {
    getAttrs: (attrs: {
      className?: string
    }) => {
      onClick?: () => void
      onMouseEnter?: () => void
      onMouseLeave?: () => void
    }
  }) => ReactNode
}

const Pop = ({ type, children, ...tooltip }: Tooltip & Pop) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  const getAttrs = (attrs: { className?: string }) =>
    Object.assign(
      {},
      attrs,
      {
        className: c(
          attrs.className,
          { tooltip: s.reference, pop: 'clickable' }[type]
        )
      },
      {
        tooltip: {
          onMouseEnter: !isOpen ? open : undefined,
          onMouseLeave: isOpen ? close : undefined
        },
        pop: {
          onClick: toggle
        }
      }[type]
    )

  return (
    <>
      {children({ getAttrs })}
      {isOpen && <Tooltip className={s.tooltip} {...tooltip} />}
    </>
  )
}

export default Pop
