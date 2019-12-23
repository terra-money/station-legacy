import React from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const { address } = useAuth()
  return (
    <WithRequest url="/oracle/denoms/actives">
      {({ result: actives }: { result: string[] }) => (
        <Page title={t('Market')}>
          <div className="row">
            <div className="col col-6">
              <Price actives={actives} />
            </div>

            <div className="col col-6">
              <RateList denoms={actives} />
            </div>
          </div>

          <Card title={t('Swap coins')} bordered>
            <WithAuth>
              <WithRequest url={`/v1/bank/${address}`}>
                {({ balance }: Bank) => (
                  <Swap
                    denoms={['uluna', ...actives]}
                    getMax={denom => {
                      const b = find<Balance>(balance)(denom)
                      return b ? b.available : String(0)
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
