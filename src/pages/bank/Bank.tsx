import React from 'react'
import { useAuth } from '../../hooks'
import WithRequest from '../../components/WithRequest'
import Page from '../../components/Page'
import Card from '../../components/Card'
import Info from '../../components/Info'
import Icon from '../../components/Icon'
import Flex from '../../components/Flex'
import Pop from '../../components/Pop'
import WithAuth from '../../components/WithAuth'
import Address from './Address'
import Vesting from './Vesting'
import AvailableList from './AvailableList'
import s from './Bank.module.scss'

const TOOLTIP = `This displays your investment with Terra.
Vested Luna can be delegated in the meantime.`

const Bank = () => {
  const { address } = useAuth()
  return (
    <Page title="Bank">
      <WithAuth card>
        <Card title="My Wallet" bordered>
          <Address address={address} />
        </Card>

        <WithRequest url={`/v1/bank/${address}`}>
          {({ balance, vesting }: Bank) => (
            <>
              {balance.length ? (
                <AvailableList list={balance} />
              ) : (
                <Card>
                  <Info icon="info" title="Account empty">
                    This account doesn't hold any coins yet.
                  </Info>
                </Card>
              )}

              {!!vesting.length && (
                <Card
                  title={
                    <Pop
                      type="tooltip"
                      placement="top"
                      content={<p className={s.tooltip}>{TOOLTIP}</p>}
                    >
                      <Flex>
                        Vesting
                        <Icon name="info" className={s.icon} />
                      </Flex>
                    </Pop>
                  }
                >
                  {vesting.map((v, i) => (
                    <Vesting {...v} key={i} />
                  ))}
                </Card>
              )}
            </>
          )}
        </WithRequest>
      </WithAuth>
    </Page>
  )
}

export default Bank
