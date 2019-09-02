import React, { HTMLAttributes } from 'react'
import c from 'classnames'
import s from './ProgressCircle.module.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number
  color?: string
  variant?: object
}

const ProgressCircle = (props: Props) => {
  const { size = 18, color = '#2043b5', variant = {}, className } = props
  return (
    <div
      className={c(s.container, className)}
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
