import React from 'react'
import s from './ProgressCircle.module.scss'

type Props = { size?: number; color?: string; variant?: object }
const ProgressCircle = (props: Props) => {
  const { size = 18, color = '#2043b5', variant = {} } = props
  return (
    <div
      className={s.container}
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
