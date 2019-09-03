import React from 'react'
import { Link } from 'react-router-dom'
import c from 'classnames'
import { percent, sum, div } from '../../api/math'
import { ReactComponent as Terra } from '../../helpers/Terra.svg'
import Amount from '../../components/Amount'
import Pop from '../../components/Pop'
import s from './ValidatorItem.module.scss'
import DelegationTooltip from './DelegationTooltip'

type Props = { validator: Validator; rank: number; total?: string }
const renderItem = ({ validator, rank, total }: Props) => {
  const { description, operatorAddress } = validator
  const { votingPower, commissionInfo, upTime } = validator
  const { myDelegation, myUndelegation = [] } = validator

  const renderMyDelegation = (total: string) => {
    const getWidth = (n: string) => percent(div(n, total), 0)
    const myUndelegationAmount = sum(myUndelegation.map(u => u.amount))
    const hasData = myDelegation || !!myUndelegation.length

    const number = (
      <div className={s.number}>
        {myDelegation ? <Amount>{myDelegation}</Amount> : '-'}
        <br />

        {!!myUndelegation.length && (
          <small>
            (<Amount>{myUndelegationAmount}</Amount>)
          </small>
        )}
      </div>
    )

    return hasData ? (
      <Pop
        type="tooltip"
        placement="bottom"
        width={420}
        content={<DelegationTooltip {...validator} />}
      >
        {({ ref, getAttrs }) => (
          <span {...getAttrs({ className: s.graph })} ref={ref}>
            <span
              className={c(s.bar, s.undelegation)}
              style={{ width: getWidth(myUndelegationAmount) }}
            />
            <span
              className={c(s.bar, s.delegation)}
              style={{ width: getWidth(myDelegation) }}
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
    <div className={c(s.rank, getClassName(rank))}>{rank}</div>,
    <h1 className={s.name}>
      {description.profileIcon ? (
        <img {...thumbnail} src={description.profileIcon} alt="" />
      ) : (
        <Terra {...thumbnail} />
      )}

      <Link to={`/validator/${operatorAddress}`} className="text-primary">
        {description.moniker}
      </Link>
    </h1>,
    percent(votingPower.weight),
    percent(commissionInfo.rate, 0),
    percent(upTime, 0),
    null,
    total && renderMyDelegation(total)
  ]
}

export default renderItem

/* helpers */
const getClassName = (n: number) => c(n <= 10 && s.top, n <= 3 && s[`top-${n}`])
