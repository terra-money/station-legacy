import { ValidatorUI, format } from '../../lib'
import { DelegateType } from '../../post/hooks/staking/useDelegate'
import { useApp } from '../../hooks'
import Card from '../../components/Card'
import Number from '../../components/Number'
import Icon from '../../components/Icon'
import Pop from '../../components/Pop'
import ActionBar from '../../components/ActionBar'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import DelegationTooltip from '../staking/DelegationTooltip'
import Delegate from '../../post/Delegate'
import Withdraw from '../../post/Withdraw'
import s from './Actions.module.scss'

const Actions = (v: ValidatorUI) => {
  const { operatorAddress } = v
  const { delegate, redelegate, undelegate, withdraw } = v
  const { myDelegations, myActionsTable, myRewards } = v

  const { modal } = useApp()

  /* tx */
  const open = {
    delegate: ({ type }: { type: DelegateType }) =>
      modal.open(<Delegate address={operatorAddress.address} type={type} />),
    withdraw: () =>
      myRewards.amounts &&
      modal.open(
        <Withdraw
          amounts={myRewards.amounts}
          validators={[operatorAddress.address]}
        />
      ),
  }

  /* render */
  const content = myActionsTable && <DelegationTooltip {...myActionsTable} />
  const myDelegation =
    myDelegations.display ?? format.display({ amount: '0', denom: 'uluna' })

  return (
    <div className="row text-center">
      <div className="col">
        <Card className={s.card}>
          <h1>{myDelegations.title}</h1>
          <section className={s.content}>
            {content ? (
              <Pop type="pop" placement="bottom" width={400} content={content}>
                {({ ref, iconRef, getAttrs }) => (
                  <span {...getAttrs({ className: s.pop })} ref={ref}>
                    <Number {...myDelegation} fontSize={18} />
                    <Icon name="arrow_drop_down" forwardRef={iconRef} />
                  </span>
                )}
              </Pop>
            ) : (
              <Number {...myDelegation} fontSize={18} />
            )}
          </section>

          <ActionBar
            list={[
              <ButtonWithAuth
                {...delegate}
                onClick={() => open.delegate({ type: DelegateType.D })}
                className="btn btn-sm btn-primary"
              />,
              <ButtonWithAuth
                {...redelegate}
                onClick={() => open.delegate({ type: DelegateType.R })}
                className="btn btn-sm btn-primary"
              />,
              <ButtonWithAuth
                {...undelegate}
                onClick={() => open.delegate({ type: DelegateType.U })}
                className="btn btn-sm btn-sky"
              />,
            ]}
          />
        </Card>
      </div>

      <div className="col">
        <Card className={s.card}>
          <h1>{myRewards.title}</h1>
          <section className={s.content}>
            <Number {...myRewards.display} fontSize={18} estimated />
          </section>

          <section className={s.actions}>
            <span className={s.action}>
              <ButtonWithAuth
                {...withdraw}
                onClick={() => open.withdraw()}
                className="btn btn-sky btn-sm"
              />
            </span>
          </section>
        </Card>
      </div>
    </div>
  )
}

export default Actions
