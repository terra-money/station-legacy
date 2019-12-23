import React from 'react'
import c from 'classnames'
import { useTranslation } from 'react-i18next'
import { percent, gt, gte, min } from '../api/math'
import { ReactComponent as Tilde } from '../helpers/Tilde.svg'
import Icon from './Icon'
import s from './Orb.module.scss'

interface Props {
  ratio?: string
  size: number
  className?: string
}

const Orb = ({ ratio = '0', size, className }: Props) => {
  const { t } = useTranslation()

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

        {gte(ratio, 1) && (
          <div>
            <Icon name="check_circle" size={36} />
            <p>{t('Min deposit completed')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orb
