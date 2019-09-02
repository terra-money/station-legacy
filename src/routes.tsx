import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Dashboard from './pages/dashboard/Dashboard'
import Bank from './pages/bank/Bank'
import Txs from './pages/transactions/Txs'
import Staking from './pages/staking/Staking'
import Validator from './pages/validator/Validator'
import Market from './pages/market/Market'
import NotFound from './pages/NotFound'

export default (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/bank" exact component={Bank} />
    <Route path="/transactions" component={Txs} />
    <Route path="/staking" component={Staking} />
    <Route path="/validator/:address" component={Validator} />
    <Route path="/market" component={Market} />
    <Route component={NotFound} />
  </Switch>
)
