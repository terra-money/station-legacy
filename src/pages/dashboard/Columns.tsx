import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { times, percent, div } from '../../api/math'
import { format } from '../../utils'
import WithRequest from '../../components/WithRequest'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Amount from '../../components/Amount'
import Issuance from './Issuance'
import CommunityPool from './CommunityPool'

interface Props {
  dashboard: Dashboard
  onClickPrice: () => void
}

const Component = ({ dashboard, onClickPrice }: Props) => {
  const { prices, taxRate, taxCaps, issuances, communityPool } = dashboard
  const { stakingPool } = dashboard

  return (
    <div className="row">
      <div className="col col-20 col-full-1280">
        <Card
          title="Luna price"
          footer={
            <Badge small active>
              {format.denom('ukrw')}
            </Badge>
          }
          onClick={onClickPrice}
          small
        >
          <Amount denom="ukrw" fontSize={20}>
            {times(prices.ukrw, 1e6)}
          </Amount>
        </Card>
      </div>

      <div className="col col-20 col-6-1280">
        <Card
          title="Tax rate"
          footer={
            <Badge small light>
              Capped at {taxCaps.map(formatTaxCap).join(' / ')}
            </Badge>
          }
          small
        >
          <span style={{ fontSize: 20 }}>{percent(taxRate, 3)}</span>
        </Card>
      </div>

      <div className="col col-20 col-6-1280">
        <Issuance issuances={issuances} />
      </div>

      <div className="col col-20 col-6-1280">
        <CommunityPool pool={communityPool} />
      </div>

      <div className="col col-20 col-6-1280">
        <Card
          title="Staking ratio"
          footer={
            <Badge small light>
              Staked Luna / Total Luna
            </Badge>
          }
          small
        >
          <span style={{ fontSize: 20 }}>
            {percent(stakingPool.stakingRatio)}
          </span>

          <p>
            <small>
              (<Amount hideDecimal>{stakingPool.bondedTokens}</Amount> Luna
              staked)
            </small>
          </p>
        </Card>
      </div>
    </div>
  )
}

const Columns = ({ history }: RouteComponentProps) => (
  <WithRequest url="/v1/dashboard">
    {(data: Dashboard) => (
      <Component
        dashboard={data}
        onClickPrice={() => history.push('/market')}
      />
    )}
  </WithRequest>
)

export default withRouter(Columns)

/* helpers */
const formatTaxCap = ({ taxCap, denom }: TaxCap) =>
  [new BigNumber(div(taxCap, 1e6)).toNumber(), format.denom(denom)].join(' ')
