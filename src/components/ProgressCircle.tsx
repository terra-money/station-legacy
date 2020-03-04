import React, { HTMLAttributes } from 'react'
import c from 'classnames'
import s from './ProgressCircle.module.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number
  color?: string
  variant?: object
  center?: boolean
}

const ProgressCircle = ({ size = 18, color = '#2043b5', ...props }: Props) => {
  const { variant = {}, className, center } = props
  return (
    <div
      className={c(s.container, center && s.center, className)}
      style={{ width: size, height: size, ...variant }}
    >
      <div className={s.wrapper} style={{ borderColor: color }}>
        <div className={s.side}>
          <div className={s.left} />
        </div>
        <div className={s.side}>
          <div className={s.right} />
        </div>
      </div>
    </div>
  )
}

export default ProgressCircle
