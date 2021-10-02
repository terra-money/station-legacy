import { useHistory, useRouteMatch } from 'react-router-dom'
import { Switch, Route, Redirect } from 'react-router-dom'
import extension from 'extensionizer'
import { useAuthMenu } from '../lib'
import { AuthMenuKey } from '../lib'
import { loadKeys } from '../utils/localStorage'
import { useAddress } from '../data/auth'
import { menu } from './getAuthMenu'
import getAuthMenuKeys from './getAuthMenuKeys'
import AuthMenu from './AuthMenu'
import Recover from './Recover'
import SignUp from './SignUp'
import SignIn from './SignIn'
import SignInWithLedger from './SignInWithLedger'
import ImportKey from './ImportKey'

const AuthRoute = () => {
  const { push } = useHistory()
  const { path, url } = useRouteMatch()

  const keys: AuthMenuKey[] = getAuthMenuKeys()
  const { ui, list } = useAuthMenu(keys)

  const address = useAddress()

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
      {address && <Redirect to="/" />}
      <Route path={path + '/'} exact render={render} />
      <Route path={path + '/ledger'} component={SignInWithLedger} />
      <Route path={path + '/select'} component={SignIn} />
      <Route path={path + '/new'} component={SignUp} />
      <Route path={path + '/recover'} component={Recover} />
      <Route path={path + '/import'} component={ImportKey} />
    </Switch>
  )
}

export default AuthRoute
