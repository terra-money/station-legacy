import React from 'react'
import { useDashboard, DashboardUI } from '@terra-money/use-station'
import Prices from './Prices'
import TaxRate from './TaxRate'
import DisplaySelector from './DisplaySelector'
import StakingRatio from './StakingRatio'

const Columns = () => {
  const { ui } = useDashboard()

  const render = (ui: DashboardUI) => (
    <div className="row">
      <div className="col col-20 col-full-1280">
        <Prices {...ui.prices} />
      </div>

      <div className="col col-20 col-6-1280">
        <TaxRate {...ui.taxRate} />
      </div>

      <div className="col col-20 col-6-1280">
        <DisplaySelector {...ui.issuance} />
      </div>

      <div className="col col-20 col-6-1280">
        <DisplaySelector {...ui.communityPool} />
      </div>

      <div className="col col-20 col-6-1280">
        <StakingRatio {...ui.stakingRatio} />
      </div>
    </div>
  )

  return ui ? render(ui) : null
}

export default Columns
