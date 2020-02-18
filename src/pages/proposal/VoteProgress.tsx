import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import s from './VoteProgress.module.scss'
import { percent, times, sum, gt, lt } from '../../api/math'
import { optionColors } from '../governance/constants'

interface Props extends Partial<TallyingParameters> {
  ratio: string
  list: VoteOption[]
}

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

const VoteProgress = ({ threshold, quorum, ratio, list }: Props) => {
  const { t } = useTranslation()

  const getRatio = (label: string) =>
    list.find(item => item.label === label)?.ratio ?? '0'

  const d = sum(['Yes', 'No', 'NoWithVeto'].map(getRatio))
  const showQuorum = quorum && lt(ratio, quorum)
  const showThreshold = gt(d, 0) && !!threshold
  const showFlag = showQuorum || showThreshold

  return (
    <div className={c(s.container, showFlag && s.gutter)}>
      {showFlag && (
        <Flag
          left={
            showQuorum
              ? percent(quorum!)
              : percent(times(times(ratio, d), threshold!))
          }
        >
          {showQuorum ? t('Quorum') : t('Pass threshold')}
        </Flag>
      )}

      <div className={s.track}>
        {list.map((item, index) => {
          const style = {
            background: optionColors[item.label],
            width: percent(times(ratio, item.ratio))
          }

          return <div className={s.item} style={style} key={index} />
        })}
      </div>
    </div>
  )
}

export default VoteProgress
