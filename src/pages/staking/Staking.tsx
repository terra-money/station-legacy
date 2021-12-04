import { useMenu, useStaking } from '../../lib'
import { StakingPersonal } from '../../lib'
import { useApp, useSearch } from '../../hooks'
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
  const { Staking: title } = useMenu()
  const [sp] = useSearch()

  const getInitialSorter = () => {
    const by = sp.get('by')
    const sort = sp.get('sort') ?? undefined
    return by ? { by, sort } : undefined
  }

  const { error, loading, personal, ui } = useStaking(getInitialSorter())

  const renderButton = ({ withdrawAll }: StakingPersonal) => {
    const { attrs, amounts, validators } = withdrawAll

    return (
      <ButtonWithAuth
        {...attrs}
        onClick={() =>
          modal.open(<Withdraw amounts={amounts} validators={validators} />)
        }
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
      {error ? (
        <ErrorComponent error={error} card />
      ) : loading ? (
        <Loading card />
      ) : (
        render()
      )}
    </Page>
  )
}

export default Staking
