import React from 'react'
import ChartCard from './ChartCard'

const Charts = () => (
  <>
    <div className="row">
      <div className="col col-6">
        <ChartCard chartKey="TxVolume" />
      </div>
      <div className="col col-6">
        <ChartCard chartKey="StakingReturn" />
      </div>
    </div>

    <div className="row">
      <div className="col col-6">
        <ChartCard chartKey="TaxRewards" />
      </div>
      <div className="col col-6">
        <ChartCard chartKey="TotalAccounts" />
      </div>
    </div>
  </>
)

export default Charts
