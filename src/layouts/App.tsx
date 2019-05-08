import React, { useState, useEffect, createContext, ReactNode } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import axios from 'axios'
import { isProduction, isElectron } from '../helpers/env'
import electron from '../helpers/electron'
import { changeChain, ChainList } from '../api/api'
import { report } from '../utils'
import { getLastAddress } from '../utils/localStorage'
import { getLastChain, setLastChain } from '../utils/localStorage'
import { useModal } from '../hooks'
import routes from '../routes'
import Modal from '../components/Modal'
import ModalContent from '../components/ModalContent'
import Version from '../pages/Version'
import Auth from '../pages/auth/Auth'
import Nav from './Nav'
import Header from './Header'
import AuthContext, { useAuthContext } from './AuthContext'
import s from './App.module.scss'

type AppContext = {
  key: number
  isReady: boolean
  refresh: () => void
  authModal: { open: () => void; close: () => void }

  chain: string
  selectChain: (chain: string) => void

  goBack: string
  setGoBack: (path: string) => void
}

const initial = {
  key: 0,
  isReady: false,
  refresh: () => {},
  authModal: { open: () => {}, close: () => {} },

  chain: getLastChain() || ChainList[Number(!isProduction)],
  selectChain: () => {},

  goBack: '',
  setGoBack: () => {}
}

export const AppContext = createContext<AppContext>(initial)

const App = ({ location, history }: RouteComponentProps) => {
  /* context: modal */
  const modal = useModal()

  /* context: auth */
  const auth = useAuthContext({
    onSignIn: () => modal.close(),
    onSignOut: () => {}
  })

  /* effect: app */
  const [chain, setChain] = useState<string>(initial.chain)
  const [key, setKey] = useState<number>(initial.key) // refresh
  const [disabled, setDisabled] = useState<ReactNode>()
  const refresh = () => setKey(k => k + 1)

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const onDeprecated = (data: Version) => {
          const content = <Version {...data} />
          data.forceUpdate
            ? setDisabled(content)
            : modal.open(
                <ModalContent close={modal.close}>{content}</ModalContent>
              )
        }

        const url = 'https://terra.money/station/version.json'
        const { data } = await axios.get<Version>(url)
        const version = electron<string>('version')
        version !== data.version && onDeprecated(data)
      } catch (error) {
        report(error)
      }
    }

    const ready = async () => {
      const address = getLastAddress()
      address && auth.signin({ address })
      changeChain(chain)
      isElectron && (await checkVersion())
      setKey(1)
    }

    ready()
    // eslint-disable-next-line
  }, [])

  /* provider: auth */
  const authModal = {
    open: () => modal.open(<Auth onClose={modal.close} />),
    close: modal.close
  }

  /* provider: app */
  const [goBack, setGoBack] = useState(initial.goBack) // Header
  const selectChain = (chain: string) => {
    setLastChain(chain)
    changeChain(chain)
    setChain(chain)
    location.pathname.includes('/validator') && history.push('/staking')
    refresh()
  }

  const isReady = !!key
  const app = Object.assign(
    { key, isReady, refresh, authModal },
    { chain, selectChain, goBack, setGoBack }
  )

  return disabled ? (
    <>{disabled}</>
  ) : isReady ? (
    <AppContext.Provider value={app}>
      <AuthContext.Provider value={auth}>
        <Nav pathname={location.pathname} />
        <section className={s.main}>
          <Header className={s.header} />
          <section className={s.content} key={key}>
            {routes}
          </section>
        </section>
        <Modal config={modal.config}>{modal.content}</Modal>
      </AuthContext.Provider>
    </AppContext.Provider>
  ) : null
}

export default withRouter(App)
