import React from 'react'
import c from 'classnames'
import { ValidatorUI } from '@terra-money/use-station'
import { ReactComponent as Terra } from '../../images/Terra.svg'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Number from '../../components/Number'
import ExtLink from '../../components/ExtLink'
import ViewProfile from './ViewProfile'
import s from './Header.module.scss'

const thumbnail = { className: s.thumbnail, width: 80, height: 80 }
const Header = (v: ValidatorUI) => {
  const { profile, moniker, status, link, details, operatorAddress } = v
  const { votingPower, selfDelegation, commission, uptime } = v

  const title = (
    <header className={s.header}>
      {profile ? (
        <img {...thumbnail} src={profile} alt="" />
      ) : (
        <Terra {...thumbnail} />
      )}

      <section>
        <h1 className={s.moniker}>
          {moniker}
          <Badge className={getBadgeClassName(status)}>{status}</Badge>
        </h1>

        <p className={s.p}>
          <ExtLink href={link}>{link}</ExtLink>
        </p>

        <p className={s.p}>{details}</p>
        <ViewProfile address={operatorAddress.address} />
      </section>
    </header>
  )

  return (
    <Card title={title} bordered>
      <div className={c('row', s.summary)}>
        <article className="col">
          <h1>{votingPower.title}</h1>
          <p>{votingPower.percent}</p>
          <hr />
          <Number {...votingPower.display} fontSize={14} integer />
        </article>

        <article className="col">
          <h1>{selfDelegation.title}</h1>
          <p>{selfDelegation.percent}</p>
          <hr />
          <Number {...selfDelegation.display} fontSize={14} integer />
        </article>

        <article className="col">
          <h1>{commission.title}</h1>
          <p>{commission.percent}</p>
        </article>

        <article className="col">
          <h1>
            {uptime.title}
            <span className="desktop"> ({uptime.desc})</span>
          </h1>
          <p>{uptime.percent}</p>
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
    jailed: 'danger',
  }

  return c(`badge-${suffix[status]}`, s.status)
}
