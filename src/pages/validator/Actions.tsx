import React from 'react'
import { gte, gt } from '../../api/math'
import { useModal, useAuth } from '../../hooks'
import Card from '../../components/Card'
import Modal from '../../components/Modal'
import Amount from '../../components/Amount'
import Icon from '../../components/Icon'
import Pop from '../../components/Pop'
import ActionBar from '../../components/ActionBar'
import ButtonWithName from '../../components/ButtonWithName'
import Delegate from '../staking/Delegate'
import Withdraw from '../staking/Withdraw'
import Claim from '../staking/Claim'
import DelegationTooltip from '../staking/DelegationTooltip'
import s from './Actions.module.scss'

const Actions = (v: Validator) => {
  const { description, myRewards } = v
  const modal = useModal()
  const { address, name, withLedger } = useAuth()

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
            >
              {({ ref, iconRef, getAttrs }) => (
                <span {...getAttrs({ className: s.pop })} ref={ref}>
                  <Amount denom="uluna" fontSize={18}>
                    {v.myDelegation}
                  </Amount>
                  <Icon name="arrow_drop_down" forwardRef={iconRef} />
                </span>
              )}
            </Pop>
          </section>

          <ActionBar
            list={[
              <ButtonWithName
                onClick={() => delegate({})}
                className="btn btn-sm btn-primary"
                disabled={
                  (!name && !withLedger) ||
                  !(v.myDelegatable && gt(v.myDelegatable, 0)) ||
                  v.status === 'jailed'
                }
              >
                Delegate
              </ButtonWithName>,

              <ButtonWithName
                onClick={() => delegate({ undelegate: true })}
                className="btn btn-sm btn-sky"
                disabled={(!name && !withLedger) || !v.myDelegation}
              >
                Undelegate
              </ButtonWithName>
            ]}
          />
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

          <section className={s.actions}>
            <span className={s.action}>
              <ButtonWithName
                onClick={() => withdraw()}
                className="btn btn-sky btn-sm"
                disabled={
                  (!name && !withLedger) ||
                  !(myRewards && gte(myRewards.total, 1))
                }
              >
                Withdraw Rewards
              </ButtonWithName>
            </span>

            {v.accountAddress === address && (name || withLedger) && (
              <span className={s.action}>
                <ButtonWithName
                  onClick={() => claim()}
                  className="btn btn-sky btn-sm"
                >
                  Claim
                </ButtonWithName>
              </span>
            )}
          </section>
        </Card>
      </div>
    </div>
  )
}

export default Actions
