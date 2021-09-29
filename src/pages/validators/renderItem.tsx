import { Link } from 'react-router-dom'
import c from 'classnames'
import { Dictionary } from 'ramda'
import { ValidatorUI } from '../../lib'
import { ReactComponent as Terra } from '../../images/Terra.svg'
import { ReactComponent as New } from './New.svg'
import { ReactComponent as Check } from './Check.svg'
import Number from '../../components/Number'
import Pop from '../../components/Pop'
import DelegationTooltip from '../staking/DelegationTooltip'
import s from './renderItem.module.scss'

const renderItem = (props: ValidatorUI, validators?: Dictionary<string>) => {
  const { rank, profile, operatorAddress, moniker } = props
  const { votingPower, selfDelegation, commission } = props
  const { uptime, myDelegations, myUndelegations, myActionsTable } = props

  const renderMyDelegation = () => {
    const number = (
      <div className={s.number}>
        {myDelegations.display ? (
          <Number>{myDelegations.display.value}</Number>
        ) : (
          '-'
        )}
        <br />
        {myUndelegations.display && (
          <small>
            (<Number>{myUndelegations.display.value}</Number>)
          </small>
        )}
      </div>
    )

    const content = myActionsTable && <DelegationTooltip {...myActionsTable} />
    return content ? (
      <Pop type="tooltip" placement="bottom" width={420} content={content}>
        {({ ref, getAttrs }) => (
          <span {...getAttrs({ className: s.graph })} ref={ref}>
            <span
              className={c(s.bar, s.undelegation)}
              style={{ width: myUndelegations.percent }}
            />
            <span
              className={c(s.bar, s.delegation)}
              style={{ width: myDelegations.percent }}
            />
            {number}
          </span>
        )}
      </Pop>
    ) : (
      <div className={s.graph}>{number}</div>
    )
  }

  const thumbnail = { width: 26, height: 26, className: s.thumbnail }
  return [
    rank ? (
      <div className={c(s.rank, getClassName(rank!))}>{rank}</div>
    ) : (
      <New />
    ),
    <h1 className={s.name}>
      {profile ? (
        <img {...thumbnail} src={profile} alt="" />
      ) : (
        <Terra {...thumbnail} />
      )}

      <Link
        to={`/validator/${operatorAddress.address}`}
        className="text-primary"
      >
        {moniker}
      </Link>

      {!!validators?.[operatorAddress.address] && <Check className={s.check} />}
    </h1>,
    <span className={s.percent}>{votingPower.percent}</span>,
    <span className={s.percent}>{selfDelegation.percent}</span>,
    <span className={s.percent}>{commission.percent}</span>,
    <span className={s.percent}>{uptime.percent}</span>,
    null,
    renderMyDelegation(),
  ]
}

export default renderItem

/* helpers */
const getClassName = (n: number) => c(n <= 10 && s.top, n <= 3 && s[`top-${n}`])
