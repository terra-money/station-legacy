import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useHistory, useLocation } from 'react-router-dom'
import { isNil } from 'ramda'
import '@ledgerhq/hw-transport-webusb' // include in bundle
import { useAuth } from '@terra-money/use-station'
import { useExtension } from './useExtension'
import AuthRoute from '../auth/AuthRoute'
import ManageWallet from '../auth/ManageWallet'
import Bank from '../pages/bank/Bank'
import Network from '../pages/settings/Network'
import Connect from '../extension/Connect'
import Confirm from '../extension/Confirm'

const Extension = () => {
  const { user } = useAuth()
  const { connect, request } = useExtension()
  const isRequested = [request.list.sign, request.list.post].some(
    // If there is a request to handle either sign or post,
    (list) => list.filter(({ success }) => isNil(success)).length
  )

  /* Redirect on requested */
  useRedirect(
    !user
      ? '/auth'
      : connect.list.length
      ? '/connect'
      : isRequested
      ? '/confirm'
      : undefined
  )

  return (
    <Switch>
      <Route path="/" exact component={Bank} />
      <Route path="/auth" component={AuthRoute} />
      <Route path="/settings" component={ManageWallet} />
      <Route path="/network" component={Network} />
      <Route path="/connect" component={Connect} />
      <Route path="/confirm" component={Confirm} />
    </Switch>
  )
}

export default Extension

/* helpers */
const useRedirect = (to?: string) => {
  const { pathname } = useLocation()
  const { push } = useHistory()

  useEffect(() => {
    to && !pathname.startsWith(to) && push(to)
  }, [to, pathname, push])
}
