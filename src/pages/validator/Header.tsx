import React from 'react'
import { useTranslation } from 'react-i18next'
import c from 'classnames'
import { percent } from '../../api/math'
import { format } from '../../utils'
import { ReactComponent as Terra } from '../../helpers/Terra.svg'
import Amount from '../../components/Amount'
import Badge from '../../components/Badge'
import Card from '../../components/Card'
import s from './Header.module.scss'

const thumbnail = { className: s.thumbnail, width: 80, height: 80 }
const Header = (v: Validator) => {
  const { t } = useTranslation()
  return (
    <Card
      title={
        <header className={s.header}>
          {v.description.profileIcon ? (
            <img src={v.description.profileIcon} alt="" {...thumbnail} />
          ) : (
            <Terra {...thumbnail} />
          )}
          <section>
            <h1 className={s.moniker}>
              {v.description.moniker}
              <Badge className={getBadgeClassName(v.status)}>{v.status}</Badge>
            </h1>
            <p className={s.p}>
              <a
                href={v.description.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {v.description.website}
              </a>
            </p>
            <p className={s.p}>{v.description.details}</p>
          </section>
        </header>
      }
      bordered
    >
      <div className={c('row', s.summary)}>
        <article className="col">
          <h1>{t('Voting power')}</h1>
          <p>{percent(v.votingPower.weight)}</p>
          <hr />
          <span style={{ fontSize: 14 }}>
            {format.amount(v.votingPower.amount).split('.')[0]}{' '}
            <small>Luna</small>
          </span>
        </article>

        <article className="col">
          <h1>{t('Self-delegation')}</h1>
          <p>{percent(v.selfDelegation.weight)}</p>
          <hr />
          <Amount fontSize={14} denom="uluna">
            {v.selfDelegation.amount}
          </Amount>
        </article>

        <article className="col">
          <h1>{t('Commission')}</h1>
          <p>{percent(v.commissionInfo.rate, 0)}</p>
        </article>

        <article className="col">
          <h1>
            {t('Uptime')}{' '}
            <span className="desktop">({t('Last 10k blocks')})</span>
          </h1>
          <p>{percent(v.upTime, 0)}</p>
        </article>
      </div>
    </Card>
  )
}

export default Header

/* helpers */
const getBadgeClassName = (status: string) => {
  const suffix: { [status: string]: string } = {
    active: 'success',
    inactive: 'warning',
    jailed: 'danger'
  }

  return c(`badge-${suffix[status]}`, s.status)
}
