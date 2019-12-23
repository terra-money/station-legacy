import React from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import s from './VoteProgress.module.scss'
import { percent, times, sum, gt } from '../../api/math'
import { optionColors } from '../governance/constants'

interface Props {
  threshold?: string
  ratio: string
  list: VoteOption[]
}

const VoteProgress = ({ threshold, ratio, list }: Props) => {
  const { t } = useTranslation()

  const getRatio = (label: string) =>
    list.find(item => item.label === label)?.ratio ?? '0'

  const d = sum(['Yes', 'No', 'NoWithVeto'].map(getRatio))
  const showThreshold = gt(d, 0) && !!threshold
  const left = threshold && percent(times(times(ratio, d), threshold))

  return (
    <div className={c(s.container, showThreshold && s.gutter)}>
      {showThreshold && (
        <>
          <div className={s.threshold} style={{ left }}>
            {t('Pass threshold')}
          </div>
          <div className={s.flag} style={{ left }} />
        </>
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
