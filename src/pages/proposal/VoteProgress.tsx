import React, { FC } from 'react'
import c from 'classnames'
import { VoteProgressBar } from '@terra-money/use-station'
import s from './VoteProgress.module.scss'

const Flag: FC<{ left: string }> = ({ left, children }) => {
  return (
    <>
      <div className={s.threshold} style={{ left }}>
        {children}
      </div>
      <div className={s.flag} style={{ left }} />
    </>
  )
}

const VoteProgress = ({ flag, list }: VoteProgressBar) => {
  return (
    <div className={c(s.container, flag && s.gutter)}>
      {flag && <Flag left={flag.percent}>{flag.text}</Flag>}

      <div className={s.track}>
        {list.map(({ percent, color }, index) => {
          const style = { background: color, width: percent }
          return <div className={s.item} style={style} key={index} />
        })}
      </div>
    </div>
  )
}

export default VoteProgress
