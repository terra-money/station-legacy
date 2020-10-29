import React, { ReactNode, RefObject, useRef, useState, useEffect } from 'react'
import c from 'classnames'
import s from './Pop.module.scss'

const GUTTER = 20

interface TooltipProps {
  placement: 'top' | 'bottom'
  width?: number
  transform?: string
  className?: string
  arrowPosition?: number
  content: ReactNode
  forwardRef?: RefObject<HTMLDivElement>
  fixed?: boolean
}

export const Tooltip = (props: TooltipProps) => {
  const { placement, width, className, transform, arrowPosition } = props
  const { content, forwardRef } = props

  const arrowAttrs = Object.assign(
    { className: s.arrow },
    arrowPosition && {
      style: { marginLeft: arrowPosition, transform: 'translate(-50%, 0)' },
    }
  )

  return (
    <div
      className={c(className, s[placement])}
      style={{ transform, width }}
      ref={forwardRef}
    >
      {placement === 'bottom' && <div {...arrowAttrs} />}
      <div className={c(s.content)}>{content}</div>
      {placement === 'top' && <div {...arrowAttrs} />}
    </div>
  )
}

type Attrs = React.HTMLAttributes<HTMLElement>

interface PopProps {
  type: 'pop' | 'tooltip'
  fullWidth?: boolean
  children: (Params: {
    ref: RefObject<HTMLElement>
    iconRef: RefObject<HTMLSpanElement>
    getAttrs: (attrs: Attrs) => Attrs
  }) => ReactNode
}

const Pop = (props: TooltipProps & PopProps) => {
  const { type, children, fullWidth, width, fixed, ...tooltipProps } = props

  /* refs */
  const ref = useRef<HTMLElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  /* toggle tooltip */
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)
  useOnClickOutside([ref, tooltipRef], close)

  /* position */
  const [tooltipWidth, setTooltipWidth] = useState<number>()
  const [position, setPosition] = useState<{ top: number; left: number }>()
  const [arrowPosition, setArrowPosition] = useState<number>()

  /* calculate position */
  useEffect(() => {
    const getRect = (dom: HTMLElement) => dom.getBoundingClientRect()

    const calcTooltipPosition = (ref: HTMLElement, tooltip: HTMLElement) => {
      const calcTooltipWidth = () => {
        const w = width || (fullWidth && r.width)
        const max = innerWidth - 2 * GUTTER
        w && setTooltipWidth(Math.min(w, max))
      }

      const calcArrowPosition = (icon: HTMLElement) => {
        const i = getRect(icon)
        setArrowPosition(i.left + i.width / 2 - left)
      }

      const calcLeft = () => {
        const left = r.left + (r.width - t.width) / 2
        return left < GUTTER
          ? GUTTER
          : left + t.width > innerWidth
          ? innerWidth - GUTTER - t.width
          : left
      }

      /* calc */
      const innerWidth = window.innerWidth
      const r = getRect(ref)
      const t = getRect(tooltip)
      const left = calcLeft()
      const top =
        r.top +
        (fixed ? 0 : window.pageYOffset) +
        { top: -1 * t.height, bottom: r.height }[tooltipProps.placement]

      calcTooltipWidth()
      calcArrowPosition(iconRef.current || ref)
      setPosition({ top, left })
    }

    isOpen &&
      !!ref.current &&
      !!tooltipRef.current &&
      calcTooltipPosition(ref.current, tooltipRef.current)
    // eslint-disable-next-line
  }, [isOpen, tooltipWidth])

  /* render */
  const getAttrs = (attrs: Attrs) =>
    Object.assign(
      {},
      attrs,
      {
        className: c(
          attrs.className,
          { tooltip: s.reference, pop: 'clickable' }[type]
        ),
        style: attrs.style,
      },
      {
        tooltip: {
          onMouseEnter: !isOpen ? open : undefined,
          onMouseLeave: isOpen ? close : undefined,
        },
        pop: {
          onClick: toggle,
        },
      }[type]
    )

  const transform =
    position && `translate(${position.left}px, ${position.top}px)`

  return (
    <>
      {children({ ref, iconRef, getAttrs })}
      {isOpen && (
        <Tooltip
          className={c(s[type], !transform && s.hidden)}
          width={tooltipWidth}
          transform={transform}
          forwardRef={tooltipRef}
          arrowPosition={arrowPosition}
          {...tooltipProps}
        />
      )}
    </>
  )
}

export default Pop

/* hook */
const useOnClickOutside = (
  refs: RefObject<HTMLElement>[],
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const notContains = ({ current }: RefObject<HTMLElement>) =>
        current && !current.contains(event.target as Node)

      refs.every(notContains) && handler()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [refs, handler])
}
