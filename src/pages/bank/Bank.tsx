import React from 'react'
import { useAuth } from '../../hooks'
import WithRequest from '../../components/WithRequest'
import Page from '../../components/Page'
import Card from '../../components/Card'
import Info from '../../components/Info'
import WithAuth from '../../components/WithAuth'
import Address from './Address'
import AvailableList from './AvailableList'
import VestingList from './VestingList'

const Bank = () => {
  const { address } = useAuth()
  return (
    <Page title="Bank">
      <WithAuth card>
        <Card title="My wallet" bordered>
          <Address address={address} />
        </Card>

        <WithRequest url={`/v1/bank/${address}`}>
          {({ balance, vesting }: Bank) => (
            <>
              {balance.length ? (
                <AvailableList list={balance} />
              ) : (
                <Card>
                  <Info icon="info_outline" title="Account empty">
                    This account doesn't hold any coins yet.
                  </Info>
                </Card>
              )}

              {!!vesting.length && <VestingList list={vesting} />}
            </>
          )}
        </WithRequest>
      </WithAuth>
    </Page>
  )
}

export default Bank
