import React from 'react'
import { find } from '../../utils'
import { useAuth } from '../../hooks'
import Page from '../../components/Page'
import Card from '../../components/Card'
import WithAuth from '../../components/WithAuth'
import WithRequest from '../../components/WithRequest'
import Price from './Price'
import RateList from './RateList'
import Swap from './Swap'

const Market = () => {
  const { address } = useAuth()
  return (
    <WithRequest url="/oracle/denoms/actives">
      {({ actives }: { actives: string[] }) => (
        <Page title="Market">
          <div className="row">
            <div className="col col-6">
              <Price actives={actives} />
            </div>

            <div className="col col-6">
              <RateList denoms={['uluna', ...actives]} />
            </div>
          </div>

          <Card title="Swap Coins" bordered>
            <WithAuth>
              <WithRequest url={`/v1/bank/${address}`}>
                {({ balance }: Bank) => (
                  <Swap
                    denoms={['uluna', ...actives]}
                    getMax={denom => {
                      const a: Balance = find(balance)(denom)
                      return a ? a.available : String(0)
                    }}
                  />
                )}
              </WithRequest>
            </WithAuth>
          </Card>
        </Page>
      )}
    </WithRequest>
  )
}

export default Market
