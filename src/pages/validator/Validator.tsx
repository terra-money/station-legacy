import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useAuth, useGoBack } from '../../hooks'
import WithRequest from '../../components/WithRequest'
import Card from '../../components/Card'
import Page from '../../components/Page'
import NotFound from '../NotFound'
import Header from './Header'
import Actions from './Actions'
import Informations from './Informations'
import Claims from './Claims'
import Delegations from './Delegations'
import Delegators from './Delegators'
import s from './Validator.module.scss'

const Validator = ({ match }: RouteComponentProps<{ address: string }>) => {
  useGoBack('/staking')
  const { address } = useAuth()
  return (
    <WithRequest
      url={`/v1/staking/validators/${match.params.address}`}
      params={{ account: address }}
      error={<NotFound />}
    >
      {(v: Validator) => (
        <Page title="Validator Details">
          <Header {...v} />
          {address && <Actions {...v} />}

          <Card>
            <Informations {...v} />
          </Card>

          <h2>Delegations</h2>
          <div className="row">
            <div className="col col-8">
              <Card title="Event log" bodyClassName={s.delegation} bordered>
                <Delegations address={v.operatorAddress} />
              </Card>
            </div>

            <div className="col col-4">
              <Card title="Delegators" bodyClassName={s.delegation} bordered>
                <Delegators address={v.operatorAddress} />
              </Card>
            </div>
          </div>

          <Card title="Claim log" bordered>
            <Claims address={v.operatorAddress} />
          </Card>
        </Page>
      )}
    </WithRequest>
  )
}

export default Validator
