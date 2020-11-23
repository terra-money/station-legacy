import React, { useEffect } from 'react'
import { useHistory, Switch, Route, useRouteMatch } from 'react-router-dom'
import extension from 'extensionizer'
import { useAuthMenu, useAuth } from '@terra-money/use-station'
import { AuthMenuKey } from '@terra-money/use-station'
import { loadKeys } from '../utils/localStorage'
import * as ledger from '../wallet/ledger'
import { menu } from './getAuthMenu'
import getAuthMenuKeys from './getAuthMenuKeys'
import AuthMenu from './AuthMenu'
import Recover from './Recover'
import SignUp from './SignUp'
import SignIn from './SignIn'
import SignInWithLedger from './SignInWithLedger'

const AuthRoute = () => {
  const { user } = useAuth()
  const { push, replace } = useHistory()
  const { path, url } = useRouteMatch()

  useEffect(() => {
    // Close connection to Ledger. It is not allowed to be accessed from multiple tabs.
    if (user && user.ledger) {
      ledger.close()
    }

    user && replace('/')
  }, [user, replace])

  const keys: AuthMenuKey[] = getAuthMenuKeys()
  const { ui, list } = useAuthMenu(keys)

  /* render */
  const render = () => (
    <AuthMenu
      card={ui.mobile}
      list={list.map(({ label, key }) => {
        const item = menu[key]
        return Object.assign(
          {
            title: label,
            disabled: key === 'signIn' && !loadKeys().length,
            onClick: () => {
              const next: { [key: string]: string } = {
                signUp: extension.runtime?.getURL?.(`index.html#${url}/new`),
                signInWithLedger: extension.runtime?.getURL?.(
                  `index.html#${url}/ledger`
                ),
              }

              if (key in next) {
                window.open(next[key])
              } else {
                push(url + item.path)
              }
            },
            key,
          },
          item
        )
      })}
    />
  )

  return (
    <Switch>
      <Route path={path + '/'} exact render={render} />
      <Route path={path + '/ledger'} component={SignInWithLedger} />
      <Route path={path + '/select'} component={SignIn} />
      <Route path={path + '/new'} component={SignUp} />
      <Route path={path + '/recover'} component={Recover} />
    </Switch>
  )
}

export default AuthRoute
