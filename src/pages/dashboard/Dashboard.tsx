import React from 'react'
import Columns from './Columns'
import TxVolume from './TxVolume'
import StakingReturn from './StakingReturn'
import TaxProceeds from './TaxProceeds'
// import SeigniorageProceeds from './SeigniorageProceeds'
import AccountGrowth from './AccountGrowth'

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
        <TaxProceeds />
      </div>
      <div className="col col-6">
        <AccountGrowth />
        {/* <SeigniorageProceeds /> */}
      </div>
    </div>
  </>
)

export default Dashboard
