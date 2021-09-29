import { FC, RefObject, HTMLAttributes } from 'react'
import c from 'classnames'

interface Props extends HTMLAttributes<HTMLElement> {
  name: string
  size?: number
  forwardRef?: RefObject<HTMLSpanElement>
}

const Icon: FC<Props> = (props) => {
  const { name, size, className, style, forwardRef, ...attrs } = props
  return (
    <i
      {...attrs}
      className={c('material-icons', className)}
      style={{ fontSize: size, width: size, ...style }}
      ref={forwardRef}
    >
      {name}
    </i>
  )
}

export default Icon
