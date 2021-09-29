import { useParams } from 'react-router-dom'
import { ValidatorUI } from '../../lib'
import { useValidator, useMenu } from '../../lib'
import { useGoBack } from '../../hooks'
import ErrorComponent from '../../components/ErrorComponent'
import Loading from '../../components/Loading'
import Page from '../../components/Page'
import Claims from '../../tables/Claims'
import Delegations from '../../tables/Delegations'
import Delegators from '../../tables/Delegators'
import Header from './Header'
import Actions from './Actions'
import Informations from './Informations'

const Validator = () => {
  useGoBack('/staking')
  const { address: validatorAddress } = useParams<{ address: string }>()

  const { Validator: title } = useMenu()
  const { error, loading, ui, delegations } = useValidator(validatorAddress)

  const render = (ui: ValidatorUI, address: string) => (
    <>
      <Header {...ui} />
      <Actions {...ui} />
      <Informations {...ui} />

      <h2>{delegations}</h2>
      <Delegations address={address} />
      <Delegators address={address} />
      <Claims address={address} />
    </>
  )

  return (
    <Page title={title}>
      {error ? (
        <ErrorComponent error={error} />
      ) : loading ? (
        <Loading card />
      ) : (
        ui && validatorAddress && render(ui, validatorAddress)
      )}
    </Page>
  )
}

export default Validator
