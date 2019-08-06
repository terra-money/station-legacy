import React from 'react'
import { gte } from '../../api/math'
import { useModal, useAuth } from '../../hooks'
import Card from '../../components/Card'
import Modal from '../../components/Modal'
import Amount from '../../components/Amount'
import Icon from '../../components/Icon'
import Pop from '../../components/Pop'
import Delegate from '../staking/Delegate'
import Withdraw from '../staking/Withdraw'
import Claim from '../staking/Claim'
import DelegationTooltip from '../staking/DelegationTooltip'
import s from './Actions.module.scss'

const Actions = (v: Validator) => {
  const { description, myRewards } = v
  const modal = useModal()
  const { name, address } = useAuth()

  /* tx */
  const delegate = ({ undelegate }: { undelegate?: boolean }) =>
    modal.open(
      <Delegate
        to={v.operatorAddress}
        moniker={description.moniker}
        max={!undelegate ? v.myDelegatable : v.myDelegation}
        onDelegating={modal.prevent}
        onDelegate={modal.close}
        undelegate={!!undelegate}
      />
    )

  const withdraw = () =>
    myRewards &&
    modal.open(
      <Withdraw
        from={v.operatorAddress}
        amounts={myRewards.denoms}
        onWithdrawing={modal.prevent}
        onWithdraw={modal.close}
      />
    )

  const claim = () =>
    modal.open(
      <Claim {...v} onClaiming={modal.prevent} onClaim={modal.close} />
    )

  return (
    <div className="row text-center">
      <Modal config={modal.config}>{modal.content}</Modal>
      <div className="col">
        <Card className={s.card}>
          <h1>My delegation</h1>
          <section className={s.content}>
            <Pop
              type="pop"
              placement="bottom"
              width={400}
              content={<DelegationTooltip {...v} />}
              className={s.pop}
            >
              <Amount denom="uluna" fontSize={18}>
                {v.myDelegation}
              </Amount>
              <Icon name="arrow_drop_down" />
            </Pop>
          </section>

          <button
            onClick={() => delegate({})}
            className="btn btn-sm btn-primary"
            disabled={!name || v.status === 'jailed'}
          >
            Delegate
          </button>

          <button
            onClick={() => delegate({ undelegate: true })}
            className="btn btn-sm btn-sky"
            disabled={!delegate || !name || !v.myDelegation}
          >
            Undelegate
          </button>
        </Card>
      </div>

      <div className="col">
        <Card className={s.card}>
          <h1>My Rewards</h1>
          <section className={s.content}>
            <Amount denom="uluna" fontSize={18} estimated>
              {myRewards && myRewards.total}
            </Amount>
          </section>

          <button
            onClick={() => withdraw()}
            className="btn btn-sky btn-sm"
            disabled={!name || !(myRewards && gte(myRewards.total, 1))}
          >
            Withdraw Rewards
          </button>

          {v.accountAddress === address && name && (
            <button onClick={() => claim()} className="btn btn-sky btn-sm">
              Claim
            </button>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Actions
