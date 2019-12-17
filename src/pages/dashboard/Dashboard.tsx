import React from 'react'
import Columns from './Columns'
import TxVolume from '../charts/TxVolume'
import StakingReturn from '../charts/StakingReturn'
import BlockRewards from '../charts/BlockRewards'
import TotalAccounts from '../charts/TotalAccounts'

const Dashboard = () => (
  <>
    <Columns />

    <div className="row">
      <div className="col col-6">
        <TxVolume />
      </div>
      <div className="col col-6">
        <StakingReturn />
      </div>
    </div>

    <div className="row">
      <div className="col col-6">
        <BlockRewards />
      </div>
      <div className="col col-6">
        <TotalAccounts />
      </div>
    </div>
  </>
)

export default Dashboard
