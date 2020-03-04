import React from 'react'
import c from 'classnames'
import { percent, gt, min } from '@terra-money/use-station'
import { ReactComponent as Tilde } from '../images/Tilde.svg'
import Icon from './Icon'
import s from './Orb.module.scss'

interface Props {
  ratio?: string
  size: number
  className?: string
  completed?: string
}

const Orb = ({ ratio = '0', size, completed, className }: Props) => {
  return (
    <div className={c(s.orb, className)} style={{ width: size, height: size }}>
      <div className={s.bar} style={{ height: percent(min([ratio, 1])) }}>
        {gt(ratio, 0) && (
          <Tilde
            width={size}
            height={size / 10}
            style={{ top: -size / 10 / 2 }}
          />
        )}

        {completed && (
          <div>
            <Icon name="check_circle" size={36} />
            <p>{completed}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orb
