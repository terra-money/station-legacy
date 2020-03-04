import React from 'react'
import { useMenu, useStaking, useAuth } from '@terra-money/use-station'
import { StakingPersonal } from '@terra-money/use-station'
import { useApp } from '../../hooks'
import Withdraw from '../../post/Withdraw'
import ValidatorList from '../validators/ValidatorList'
import Page from '../../components/Page'
import Loading from '../../components/Loading'
import ButtonWithAuth from '../../components/ButtonWithAuth'
import ErrorComponent from '../../components/ErrorComponent'
import Columns from './Columns'
import MyDelegations from './MyDelegations'

const Staking = () => {
  const { modal } = useApp()
  const { user } = useAuth()
  const { Staking: title } = useMenu()
  const { error, loading, personal, ui } = useStaking(user)

  const renderButton = ({ withdrawAll }: StakingPersonal) => {
    const { attrs, amounts } = withdrawAll
    return (
      <ButtonWithAuth
        {...attrs}
        onClick={() => modal.open(<Withdraw amounts={amounts} />)}
        placement="bottom"
        className="btn btn-primary btn-sm"
      />
    )
  }

  const renderPersonal = (personal: StakingPersonal) => {
    const { myDelegations, myRewards } = personal
    return (
      <>
        <Columns {...personal} />
        {myDelegations && myRewards && (
          <MyDelegations list={[myDelegations, myRewards]} />
        )}
      </>
    )
  }

  const render = () => (
    <>
      {personal && renderPersonal(personal)}
      {ui && <ValidatorList {...ui} />}
    </>
  )

  return (
    <Page title={title} action={personal && renderButton(personal)}>
      {error ? <ErrorComponent card /> : loading ? <Loading card /> : render()}
    </Page>
  )
}

export default Staking
