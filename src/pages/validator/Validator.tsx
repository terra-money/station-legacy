import React from 'react'
import { useParams } from 'react-router-dom'
import { ValidatorUI } from '../../lib'
import { useValidator, useMenu, useAuth } from '../../lib'
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
  const { address } = useParams<{ address: string }>()

  const { Validator: title } = useMenu()
  const { user } = useAuth()
  const { error, loading, ui, delegations } = useValidator(address, user)

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
        ui && address && render(ui, address)
      )}
    </Page>
  )
}

export default Validator
