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
      <div className="col">
        <TxVolume />
      </div>
      <div className="col">
        <StakingReturn />
      </div>
    </div>

    <div className="row">
      <div className="col">
        <TaxProceeds />
      </div>
      <div className="col">
        <AccountGrowth />
        {/* <SeigniorageProceeds /> */}
      </div>
    </div>
  </>
)

export default Dashboard
